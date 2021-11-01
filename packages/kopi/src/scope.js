const readline = require('readline');
const { Worker } = require('worker_threads');

const { KopiString, KopiTuple, KopiVector } = require('./classes');
const { default: KopiIterable } = require('./traits/Iterable');

const core = require('./functions/core');
const { compile } = require('./compiler');

const KopiStringConstructor = (value) => new KopiString(value.toStringAsync());
KopiStringConstructor.nativeConstructor = KopiString;
KopiStringConstructor.Newline = new KopiString('\n');
KopiStringConstructor.NewlineRegExp = new KopiString(/\r?\n/);

const KopiArrayConstructor = (tuple) => tuple.getElementsArray();
KopiArrayConstructor.nativeConstructor = Array;

const Vector = (tuple) => new KopiVector(tuple.getElementAtIndex(0), tuple.getElementAtIndex(1));
Vector.nativeConstructor = KopiVector;

const KopiIterableTrait = { nativeConstructor: KopiIterable };

Number.nativeConstructor = Number;
String.nativeConstructor = String;

class KopiWorker {
  constructor(filename) {
    this.filename = filename;
    this.worker = new Worker(`./src/worker.js`, {
      workerData: filename
    });
  }
}

let getScope = (input) => ({
  worker: (filename) => {
    return new KopiWorker(filename);
  },
  union: (args) => args,
  test: (func, scope, visitors) => func.apply(undefined, [5, scope, visitors]),
  gc: () => {
    global.gc();
  },
  inspect: core.kopi_inspect,
  tuple: (array) => new KopiTuple(array),
  methods: new Map(),
  extend: core.kopi_extend,

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

  import: (filename, scope) => compile(filename.getNativeString(), scope),
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
  repeat: (func, scope, visitors) => (
    function next(value) {
      if (value?._elementsArray?.length === 0) {
        value = 1;
      }

      const nextValue = func.apply(undefined, [value, scope, visitors]);

      return new KopiTuple([nextValue, () => next(nextValue)]);
    }
  ),
  input: (str) => {
    const rl = input ?? readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(resolve => {
      rl.question(`${str.getNativeString()} `, data => {
        if (rl !== input) {
          rl.close();
        }

        resolve(new KopiString(data));
      });
    });
  },
  Vector,
  Number,
  Array: KopiArrayConstructor,
  String: KopiStringConstructor,
  Iterable: KopiIterableTrait,
});

module.exports = {
  default: getScope,
};
