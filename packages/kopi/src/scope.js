const readline = require('readline');

const { KopiTuple, KopiVector } = require('./classes');

const core = require('./functions/core');
const { compile } = require('./compiler');

const Vector = (tuple) => new KopiVector(tuple.elements[0], tuple.elements[1]);
Vector.nativeConstructor = KopiVector;

Number.nativeConstructor = Number;
String.nativeConstructor = String;

let getScope = (input) => ({
  union: (args) => args,
  test: (func, scope, visitors) => func.apply(undefined, [5, scope, visitors]),
  gc: () => {
    global.gc();
  },
  inspect: core.kopi_inspect,
  tuple: (array) => new KopiTuple(array),
  methods: new Map(),
  extend: core.kopi_extend,

  true: true,
  false: false,

  print: core.kopi_print,
  write: core.kopi_write,

  char: core.kopi_char,

  ident: core.kopi_ident,
  // compose
  // const
  // not

  random: core.kopi_random,
  date: core.kopi_date,
  time: core.kopi_time,
  read: core.kopi_read,

  even: core.kopi_even,
  // odd
  // min
  max: core.kopi_max,

  import: (filename, scope) => compile(filename, scope),
  export: (values) => values,
  let: core.kopi_let,
  match: core.kopi_match,
  fetch: core.kopi_fetch,
  listen: core.kopi_listen,
  exit: (code) => process.exit(code),

  sleep: core.kopi_sleep,
  spawn: core.kopi_spawn,
  yield: core.kopi_yield,
  send: core.kopi_send,
  tasks: core.kopi_tasks,

  at: (index) => async array => await array[index],
  loop: core.kopi_loop,
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
  Number,
  String,
});

module.exports = {
  default: getScope,
};
