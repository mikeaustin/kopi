import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiNumber, KopiString, KopiTuple, KopiArray, KopiStream, KopiBoolean } from '../modules/terminals/classes';

import KopiIterable from '../modules/terminals/traits/KopiIterable';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Range', async () => {
  var array = await interpret(`
    1..5 | map (n) => n * n | filter (n) => 'even n | toArray
  `) as KopiArray;

  expect(array).toEqual(new KopiArray([
    new KopiNumber(4),
    new KopiNumber(16),
  ]));

  var array = await interpret(`
    1..3 | map (n) => n * n | toArray
  `) as KopiArray;

  expect(array).toEqual(new KopiArray([
    new KopiNumber(1),
    new KopiNumber(4),
    new KopiNumber(9),
  ]));

  array = await interpret(`
    "a".."c" | map (c) => c | toArray
  `) as KopiArray;

  expect(array).toEqual(new KopiArray([
    new KopiString("a"),
    new KopiString("b"),
    new KopiString("c"),
  ]));

  array = await interpret(`
    "a".."c" | cycle | take 9 | toArray
  `) as KopiArray;

  expect(array).toEqual(new KopiArray([
    new KopiString("a"),
    new KopiString("b"),
    new KopiString("c"),
    new KopiString("a"),
    new KopiString("b"),
    new KopiString("c"),
    new KopiString("a"),
    new KopiString("b"),
    new KopiString("c"),
  ]));
});

test('Map and filter', async () => {
  var array = await interpret(`
    (1..5, "a".."z") | map (n, c) => (c, n * n) | filter (c, n) => 'even n | toArray
  `) as KopiArray;

  expect(array).toEqual(new KopiArray([
    new KopiTuple([Promise.resolve(new KopiString('b')), Promise.resolve(new KopiNumber(4))]),
    new KopiTuple([Promise.resolve(new KopiString('a')), Promise.resolve(new KopiNumber(16))]),
  ]));

  var array = await interpret(`
    1..3 | flatMap a => ((a + 1)..3 | map b => (a, b)) | toArray
  `) as KopiArray;

  expect(array).toEqual(new KopiArray([
    new KopiTuple([Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(2))]),
    new KopiTuple([Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(3))]),
    new KopiTuple([Promise.resolve(new KopiNumber(2)), Promise.resolve(new KopiNumber(3))]),
  ]));

  var array = await interpret(`
    1..3 | flatMap a => a * a | toArray
  `) as KopiArray;

  expect(array).toEqual(new KopiArray([
    new KopiNumber(1),
    new KopiNumber(4),
    new KopiNumber(9),
  ]));

  var stream = await interpret(
    `1..1000000000 | map (n) => (n * n) | take 3 | toArray
  `) as KopiStream;

  expect(array).toEqual(new KopiArray([
    new KopiNumber(1),
    new KopiNumber(4),
    new KopiNumber(9),
  ]));

  var number = await interpret(`
    1..2 | find (n) => 'even n
  `) as KopiNumber;

  expect(number.value).toEqual(2);

  var number = await interpret(`
    1..5 | reduce (a = 1, n) => a * n
  `) as KopiNumber;

  expect(number.value).toEqual(120);

  var boolean = await interpret(`
    1..5 | includes 3
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));

  var boolean = await interpret(`
    1..5 | includes 7
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(false));

  var boolean = await interpret(`
    "a".."e" | includes "c"
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));

  var boolean = await interpret(`
    "a".."e" | includes "g"
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(false));

  var boolean = await interpret(`
    [1, 2, 3, 4, 5] | includes 3
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));

  var boolean = await interpret(`
    [1, 2, 3, 4, 5] | includes 7
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(false));

  var boolean = await interpret(`
    "abcde" | includes "c"
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));

  var boolean = await interpret(`
    1..5 | filter 'odd | includes 3
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));

  var number = await interpret(`
    1..5 | count (n) => 'odd n
  `) as KopiNumber;

  expect(number).toEqual(new KopiNumber(3));
});

test('Take and skip', async () => {
  var array = await interpret(`
    1..5 | skip 3 | toArray
  `) as KopiArray;

  expect(array).toEqual(new KopiArray([
    new KopiNumber(4),
    new KopiNumber(5),
  ]));

  var boolean = await interpret(`
    [1, 3, 5] | some (n) => 'even n
  `) as KopiBoolean;

  expect(boolean.value).toEqual(false);

  boolean = await interpret(`
    [1, 2, 3, 4, 5] | some (n) => 'even n
  `) as KopiBoolean;

  expect(boolean.value).toEqual(true);

  array = await interpret(`
    iterate 1 (n) => n * 2 | take 3 | toArray
  `) as KopiArray;

  expect(array).toEqual(new KopiArray([
    new KopiNumber(2),
    new KopiNumber(4),
    new KopiNumber(8),
  ]));
});

describe('Splitting', () => {
  test('splitEvery', async () => {
    var array = await interpret(`
      [1, 2, 3, 4, 5] | splitEvery 2 | toArray
    `) as KopiArray;

    expect(array).toEqual(new KopiArray([
      new KopiArray([new KopiNumber(1), new KopiNumber(2)]),
      new KopiArray([new KopiNumber(3), new KopiNumber(4)]),
      new KopiArray([new KopiNumber(5)]),
    ]));

    var array = await interpret(`
      1..5 | splitEvery 2 | toArray
    `) as KopiArray;

    expect(array).toEqual(new KopiArray([
      new KopiArray([new KopiNumber(1), new KopiNumber(2)]),
      new KopiArray([new KopiNumber(3), new KopiNumber(4)]),
      new KopiArray([new KopiNumber(5)]),
    ]));

    var array = await interpret(`
      "abcabca" | splitEvery 3 | toArray
    `) as KopiArray;

    expect(array).toEqual(new KopiArray([
      new KopiString('abc'),
      new KopiString('abc'),
      new KopiString('a'),
    ]));

    var array = await interpret(`
      "abcabca" | map 'succ | splitEvery 3 | toArray
    `) as KopiArray;

    expect(array).toEqual(new KopiArray([
      new KopiString('bcd'),
      new KopiString('bcd'),
      new KopiString('b'),
    ]));
  });

  test('splitOn', async () => {
    var array = await interpret(`
      ["a", ",", "b", ",", "c"] | splitOn "," | toArray
    `) as KopiArray;

    expect(array).toEqual(new KopiArray([
      new KopiArray([new KopiString('a')]),
      new KopiArray([new KopiString('b')]),
      new KopiArray([new KopiString('c')]),
    ]));

    var array = await interpret(`
      "a,b,c" | splitOn "," | toArray
    `) as KopiArray;

    expect(array).toEqual(new KopiArray([
      new KopiString('a'),
      new KopiString('b'),
      new KopiString('c'),
    ]));

    var array = await interpret(`
      ",a,b,c," | splitOn "," | toArray
    `) as KopiArray;

    expect(array).toEqual(new KopiArray([
      new KopiString(''),
      new KopiString('a'),
      new KopiString('b'),
      new KopiString('c'),
      new KopiString(''),
    ]));

    var array = await interpret(`
      "" | splitOn "," | toArray
    `) as KopiArray;

    expect(array).toEqual(new KopiArray([
      new KopiString(''),
    ]));

    var array = await interpret(`
      "," | splitOn "," | toArray
    `) as KopiArray;

    expect(array).toEqual(new KopiArray([
      new KopiString(''),
      new KopiString(''),
    ]));
  });
});
