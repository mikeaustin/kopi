import { KopiString, KopiTuple, KopiArray, KopiDict, KopiVector } from './classes.mjs';
import _Iterable from './traits/Iterable.js';

import * as core from './functions/core.mjs';

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

const Vector = (array) => new KopiVector(array.getElementsArray());
Vector.nativeConstructor = KopiVector;

const KopiIterableMixin = new KopiTuple([
  _Iterable.map,
  _Iterable.flatMap,
  _Iterable.reduce,
  _Iterable.find,
  _Iterable.splitOn,
  _Iterable.splitEvery,
], [
  'map',
  'flatMap',
  'reduce',
  'find',
  'splitOn',
  'splitEvery',
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
  repeat: (func, scope, visitors) => (
    function next(value) {
      if (value?._elementsArray?.length === 0) {
        value = 1;
      }

      const nextValue = func.apply(undefined, [value, scope, visitors]);

      return new KopiTuple([nextValue, () => next(nextValue)]);
    }
  ),
  Vector,
  Number,
  Array: KopiArrayConstructor,
  Dict: KopiDictConstructor,
  String: KopiStringConstructor,
  Iterable: KopiIterableMixin,
});

export default getScope;
