const util = require('util');
const fs = require('fs');
const http = require('http');
const fetch = require('node-fetch');

const { KopiTuple } = require('../classes');

const coroutines = require('./coroutines');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

const kopi_inspect = (value) => {
  console.log(inspect(value));
};

const kopi_print = async (val) => {
  console.log(await val.toStringAsync());
};

const kopi_read = (filename) => {
  return util.promisify(fs.readFile)(filename, 'utf8');
};

const kopi_char = (num) => {
  return String.fromCodePoint(num);
};

const kopi_random = () => {
  return Math.random();
};

const kopi_date = () => {
  return new Date().toLocaleDateString();
};

const kopi_time = () => {
  return new Date().toLocaleTimeString();
};

const kopi_ident = (x) => {
  return x;
};

const kopi_even = (num) => {
  return num % 2 === 0;
};

const kopi_max = (tuple) => {
  return Math.max(tuple.elements[0], tuple.elements[1]);
};

const kopi_let = (fn, scope, visitors) => {
  return fn.apply(undefined, [KopiTuple.empty, scope, visitors]);
};

const kopi_match = (value, scope, visitors) => async (_funcs) => {
  const funcs = _funcs.apply ? new KopiTuple([_funcs]) : _funcs;

  for await (func of funcs.elements) {
    const predicatePassed = !(func?.params?.predicate && !await visitors.visitNode(func.params.predicate, {
      ...scope,
      [func.params.name]: value
    }));

    if (predicatePassed && func.params.getMatches(value)) {
      return func.apply(undefined, [value, scope, visitors]);
    }
  }
};

const kopi_loop = async (fn, scope, visitors) => {
  const exit = (value) => { done = true; return value; };
  const func = await fn.apply(undefined, [exit, scope, visitors]);

  let done = false;
  let index = 0;
  let value = KopiTuple.empty;

  while (!done) {
    value = await func.apply(undefined, [value, scope, visitors]);

    if (++index % 1000 === 0) {
      global.gc();
      await core.kopi_sleep(0);
    }
  }

  return value;
};

const kopi_write = (val) => {
  return new Promise(resolve => process.stdout.write(val.toStringAsync(), () => resolve()));
};

const kopi_sleep = (secs) => {
  return new Promise(resolve => setTimeout(() => resolve(secs), secs * 1000));
};

const kopi_fetch = async (url) => {
  const request = await fetch(url);

  return request.text();
};

const kopi_listen = (port) => (co) => http.createServer(async (request, response) => {
  const value = await coroutines.kopi_send(co)(request);

  response.writeHead(200);
  response.end(value);
}).listen({
  port: port,
});

const kopi_extend = (constructor) => async (methods, scope, visitors, bind) => {
  const { nativeConstructor } = constructor;

  newMethods = await methods.elements.reduce(async (newMethods, method, index) => ({
    ...await newMethods,
    [methods.fields[index]]: await method,
  }), scope.methods.get(nativeConstructor));

  bind({
    methods: new Map(scope.methods).set(nativeConstructor, newMethods)
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
