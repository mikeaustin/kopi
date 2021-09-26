const util = require('util');
const fs = require('fs');
const readline = require('readline');

const { KopiTuple, KopiVector } = require('./classes');

const core = require('./functions/core');
const { compile } = require('./compiler');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

const Vector = (tuple) => new KopiVector(tuple.elements[0], tuple.elements[1]);
Vector.nativeConstructor = KopiVector;

String.nativeConstructor = String;

let getScope = (input) => ({
  inspect: (value) => console.log(inspect(value)),
  tuple: (array) => new KopiTuple(array),
  methods: new Map(),
  extend: (constructor) => async (methods, scope) => {
    const { nativeConstructor } = constructor;

    return methods.elements.reduce(async (newMethods, method, index) => (
      (await newMethods).set(nativeConstructor, {
        ...(await newMethods).get(nativeConstructor),
        [methods.fields[index]]: await method
      }), newMethods
    ), new Map(scope.methods));
  },

  true: true,
  false: false,

  print: core.kopi_print,
  write: core.kopi_write,

  char: core.kopi_char,
  string: core.kopi_string,
  number: core.kopi_number,

  ident: core.kopi_ident,

  random: core.kopi_random,
  date: core.kopi_date,
  time: core.kopi_time,
  read: (filename) => util.promisify(fs.readFile)(filename, 'utf8'),

  even: core.kopi_even,
  max: core.kopi_max,

  import: (filename, scope) => compile(filename, scope),
  export: (values) => values,
  let: core.kopi_let,
  match: core.kopi_match,
  sleep: core.kopi_sleep,
  fetch: core.kopi_fetch,
  listen: core.kopi_listen,
  exit: (code) => process.exit(code),

  spawn: core.kopi_spawn,
  yield: core.kopi_yield,
  send: core.kopi_send,
  tasks: core.kopi_tasks,

  at: (index) => async array => await array[index],
  loop: async (fn, scope, visitors) => {
    const exit = (value) => { done = true; return value; };
    const func = await fn.apply(undefined, [exit, scope, visitors]);

    let done = false;
    let value = KopiTuple.empty;

    while (!done) {
      value = await func.apply(undefined, [value, scope, visitors]);
    }

    return value;

    // function loop(value) {
    //   setImmediate(async () => {
    //     value = await func.apply(undefined, [value, scope, visitors]);

    //     loop(value);
    //   });
    //   loop(value);
    // }
    // loop(value);
  },
  repeat: (fn, scope, visitors) => (
    function next(value) {
      if (value?.elements?.length === 0) {
        value = 1;
      }
      const nextValue = fn.apply(undefined, [value, scope, visitors]);

      return new KopiTuple([nextValue, () => next(nextValue)]);
    }
  ),
  input: (str) => {
    const rl = input ?? readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(resolve => {
      rl.question(`${str} `, data => {
        if (rl !== input) {
          rl.close();
        }

        resolve(data);
      });
    });
  },
  Vector,
  String,
});

module.exports = {
  default: getScope,
};
