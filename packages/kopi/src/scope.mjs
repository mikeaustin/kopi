import { KopiString, KopiTuple, KopiArray, KopiDict, KopiVector } from './classes.mjs';
import _Iterable from './traits/Iterable.js';

import * as core from './functions/core.mjs';

const KopiStringConstructor = (value) => new KopiString(value.toStringAsync());
KopiStringConstructor.nativeConstructor = KopiString;
KopiStringConstructor.Newline = new KopiString('\n');
KopiStringConstructor.NewlineRegExp = new KopiString(/\r?\n/);

Number.PI = Math.PI;
Number.E = Math.E;

const KopiArrayConstructor = (tuple) => new KopiArray(tuple.getFieldsArray());
KopiArrayConstructor.nativeConstructor = KopiArray;

const KopiDictConstructor = async (entries) => new KopiDict(
  await Promise.all(
    entries.getElementsArray().map(async (entry) => (await entry).getFieldsArray()),
  ),
);
KopiDictConstructor.nativeConstructor = KopiDict;

const Vector = async (array) => new KopiVector(
  await Promise.all(array.getElementsArray()),
);
Vector.nativeConstructor = KopiVector;

const KopiIterableMixin = new KopiTuple([
  _Iterable.map,
  _Iterable.flatMap,
  _Iterable.reduce,
  _Iterable.find,
  _Iterable.splitOn,
  _Iterable.splitEvery,
  _Iterable.count,
], [
  'map',
  'flatMap',
  'reduce',
  'find',
  'splitOn',
  'splitEvery',
  'count',
]);

Number.nativeConstructor = Number;
String.nativeConstructor = String;

globalThis.methods = [new Map()];

let getScope = (input) => ({
  methods: () => globalThis.methods[globalThis.methods.length - 1],
  union: (args) => args,
  test: (func, scope, visitors) => func.apply(undefined, [5, scope, visitors]),
  gc: () => {
    globalThis.gc();
  },
  inspect: core.kopi_inspect,
  tuple: (array) => new KopiTuple(array.getElementsArray()),
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

  even: core.kopi_even,
  // odd
  // min
  max: core.kopi_max,

  export: (values) => values,
  let: core.kopi_let,
  match: core.kopi_match,

  sleep: core.kopi_sleep,

  at: (index) => async (array) => await array[index],
  loop: core.kopi_loop,
  break: core.kopi_loop.break,
  repeat: (func, scope, visitors) => (
    function next(value) {
      console.log(value);
      if (value?.getFieldsArray?.()?.length === 0) {
        value = 1;
      }

      const nextValue = func.apply(undefined, [value, scope, visitors]);

      return new KopiTuple([nextValue, () => next(nextValue)]);
    }
  ),
  spawn: core.kopi_spawn,
  yield: core.kopi_yield,
  send: core.kopi_send,
  Vector,
  Number,
  Array: KopiArrayConstructor,
  Dict: KopiDictConstructor,
  String: KopiStringConstructor,
  Iterable: KopiIterableMixin,
});

export default getScope;
