const util = require('util');
const fs = require('fs');
const http = require('http');
const fetch = require('node-fetch');

const { KopiString, KopiTuple } = require('../classes');

const coroutines = require('./coroutines');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

const kopi_inspect = async (value) => {
  console.log(await value.inspectAsync());
};

const kopi_print = async (value) => {
  console.log(await value.toStringAsync());
};

const kopi_read = async (filename) => {
  return new KopiString(await util.promisify(fs.readFile)(filename.getNativeString(), 'utf8'));
};

const kopi_char = (number) => {
  return new KopiString(String.fromCodePoint(number));
};

const kopi_random = () => {
  return Math.random();
};

const kopi_date = () => {
  return new KopiString(new Date().toLocaleDateString());
};

const kopi_time = () => {
  return new KopiString(new Date().toLocaleTimeString());
};

const kopi_ident = (x) => {
  return x;
};

const kopi_even = (number) => {
  return number % 2 === 0;
};

const kopi_max = (tuple) => {
  return Math.max(tuple.getElementAtIndex(0), tuple.getElementAtIndex(1));
};

const kopi_let = (func, scope, visitors) => {
  return func.apply(undefined, [KopiTuple.empty, scope, visitors]);
};

const kopi_match = (value) => async (_funcs, scope, visitors) => {
  const funcsTuple = _funcs.apply ? new KopiTuple([_funcs]) : _funcs;

  for await (const func of funcsTuple.getElementsArray()) {
    const matches = await func.params.getMatches(value);

    const predicatePassed = !(func?.params?.predicate && !await visitors.visitNode(func.params.predicate, {
      ...scope,
      ...matches,
    }));

    if (predicatePassed && matches) {
      return func.apply(undefined, [value, { ...scope, ...matches }, visitors]);
    }
  }

  console.log('match failed.');
};

const kopi_loop = async (_func, scope, visitors) => {
  const exit = (value) => { done = true; return value; };
  const func = await _func.apply(undefined, [exit, scope, visitors]);

  let done = false;
  let index = 0;
  let value = KopiTuple.empty;

  while (!done) {
    value = await func.apply(undefined, [value, scope, visitors]);

    if (++index % 1000 === 0) {
      global.gc();
      await kopi_sleep(0);
    }
  }

  return value;
};

const kopi_write = (value) => {
  return new Promise(resolve => process.stdout.write(value.toStringAsync(), () => resolve()));
};

const kopi_sleep = (seconds) => {
  return new Promise(resolve => setTimeout(() => resolve(seconds), seconds * 1000));
};

const kopi_fetch = async (url) => {
  const request = await fetch(url.getNativeString());

  return new KopiString(await request.text());
};

const kopi_listen = (port) => (co) => http.createServer(async (request, response) => {
  const value = await coroutines.kopi_send(co)(request);

  response.writeHead(200);
  response.end(value);
}).listen({
  port: port,
});

const kopi_extend = (constructor) => (traits) => async (methodsTuple, scope, visitors, bind) => {
  const traitsTuple = traits.constructor.name !== 'KopiTuple' ? new KopiTuple([traits]) : traits;
  const { nativeConstructor } = constructor;

  const traitMethods = traitsTuple.getElementsArray().reduce((traitMethods, trait) => (
    Object.getOwnPropertyNames(trait.nativeConstructor.prototype)
      .filter(name => name !== 'constructor')
      .reduce((obj, name) => ({
        ...obj,
        [name]: (thisArg) => (args) => trait.nativeConstructor.prototype[name].apply(thisArg, [args, scope, visitors])
      }), traitMethods)
  ), {});

  const newMethods = await methodsTuple.getElementsArray().reduce(async (newMethods, method, index) => ({
    ...await newMethods,
    [methodsTuple.getFieldNameAtIndex(index)]: await method,
  }), scope.methods.get(nativeConstructor) ?? {});

  bind({
    methods: new Map(scope.methods).set(nativeConstructor, { ...traitMethods, ...newMethods })
  });
};

module.exports = {
  kopi_inspect,
  kopi_print,
  kopi_read,
  kopi_char,
  kopi_random,
  kopi_date,
  kopi_time,
  kopi_ident,
  kopi_even,
  kopi_max,
  kopi_let,
  kopi_match,
  kopi_loop,
  kopi_write,
  kopi_sleep,
  kopi_fetch,
  kopi_listen,
  kopi_spawn: coroutines.kopi_spawn,
  kopi_yield: coroutines.kopi_yield,
  kopi_send: coroutines.kopi_send,
  kopi_tasks: coroutines.kopi_tasks,
  kopi_extend,
};
