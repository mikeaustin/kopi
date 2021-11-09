import readline from 'readline';
// const { Worker } = require('worker_threads');

import _classes from './classes.js';
import _Iterable from './traits/Iterable.js';

import * as core from './functions/core.mjs';
import { compile } from './compiler.mjs';

import _terminal from '../test/terminal.js';

const { KopiString, KopiTuple, KopiArray, KopiDict, KopiVector } = _classes;

const { default: kopi_ls } = _terminal;

const KopiStringConstructor = (value) => new KopiString(value.toStringAsync());
KopiStringConstructor.nativeConstructor = KopiString;
KopiStringConstructor.Newline = new KopiString('\n');
KopiStringConstructor.NewlineRegExp = new KopiString(/\r?\n/);

const KopiArrayConstructor = (tuple) => new KopiArray(tuple.getElementsArray());
KopiArrayConstructor.nativeConstructor = KopiArray;

const KopiDictConstructor = async (entries) => new KopiDict(
  await Promise.all(entries.getElementsArray().map(async (entry) => (await entry).getElementsArray())),
);
KopiDictConstructor.nativeConstructor = KopiDict;

const Vector = (tuple) => new KopiVector(tuple.getElementAtIndex(0), tuple.getElementAtIndex(1));
Vector.nativeConstructor = KopiVector;

const KopiIterableMixin = new KopiTuple([
  _Iterable.map,
  _Iterable.flatMap,
  _Iterable.reduce,
  _Iterable.splitOn,
  _Iterable.splitEvery,
], [
  'map',
  'flatMap',
  'reduce',
  'splitOn',
  'splitEvery',
]);

Number.nativeConstructor = Number;
String.nativeConstructor = String;

// class KopiWorker {
//   constructor(filename) {
//     this.filename = filename;
//     this.worker = new Worker('./src/worker.js', {
//       workerData: filename,
//     });
//   }
// }

let getScope = (input) => ({
  ls: kopi_ls,
  worker: (filename) => {
    return new KopiWorker(filename);
  },
  union: (args) => args,
  test: (func, scope, visitors) => func.apply(undefined, [5, scope, visitors]),
  gc: () => {
    global.gc();
  },
  inspect: core.kopi_inspect,
  tuple: (array) => new KopiTuple(array.getElementsArray()),
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

  at: (index) => async (array) => await array[index],
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
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(`${str.getNativeString()} `, (data) => {
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
  Dict: KopiDictConstructor,
  String: KopiStringConstructor,
  Iterable: KopiIterableMixin,
});

export default getScope;
