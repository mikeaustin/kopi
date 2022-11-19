import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiNumber, KopiString, KopiTuple, KopiArray, KopiStream, KopiBoolean } from '../modules/terminals/classes';

import KopiIterable from '../modules/operators/traits/KopiIterable';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Range', async () => {
  var stream = await interpret(`
    1..5 | map (n) => n * n | filter (n) => 'even n
  `) as KopiStream;

  const elements = (await (stream as unknown as KopiIterable).toArray()).elements;

  expect(await Promise.all(elements)).toEqual([
    new KopiNumber(4),
    new KopiNumber(16),
  ]);

  var array = await interpret(`
    1..3 | map (n) => n * n | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(4),
    new KopiNumber(9),
  ]);

  array = await interpret(`
    "a".."c" | map (c) => c | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiString("a"),
    new KopiString("b"),
    new KopiString("c"),
  ]);

  array = await interpret(`
    "a".."c" | cycle | take 9 | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiString("a"),
    new KopiString("b"),
    new KopiString("c"),
    new KopiString("a"),
    new KopiString("b"),
    new KopiString("c"),
    new KopiString("a"),
    new KopiString("b"),
    new KopiString("c"),
  ]);
});

test('Map and filter', async () => {
  var array = await interpret(`
    (1..5, "a".."z") | map (n, c) => (c, n * n) | filter (c, n) => 'even n | toArray
  `) as KopiArray;

  // BUG: This causes <"abcabca" | splitEvery 3> stream.inspect() to throw "undefined is not a function"
  expect(await Promise.all(array.elements)).toEqual([
    new KopiTuple([Promise.resolve(new KopiString('b')), Promise.resolve(new KopiNumber(4))]),
    new KopiTuple([Promise.resolve(new KopiString('a')), Promise.resolve(new KopiNumber(16))]),
  ]);

  var array = await interpret(`
    1..3 | flatMap a => ((a + 1)..3 | map b => (a, b)) | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiTuple([Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(2))]),
    new KopiTuple([Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(3))]),
    new KopiTuple([Promise.resolve(new KopiNumber(2)), Promise.resolve(new KopiNumber(3))]),
  ]);

  var stream = await interpret(
    `1..1000000000 | map (n) => (n * n) | take 3
  `) as KopiStream;

  expect(await Promise.all((await (stream as unknown as KopiIterable).toArray()).elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(4),
    new KopiNumber(9),
  ]);

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
    [1, 2, 3, 4, 5] | includes 3
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));

  var boolean = await interpret(`
    [1, 2, 3, 4, 5] | includes 7
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(false));
});

test('Take and skip', async () => {
  var array = await interpret(`
    1..5 | skip 3 | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(4),
    new KopiNumber(5),
  ]);

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

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(2),
    new KopiNumber(4),
    new KopiNumber(8),
  ]);
});

test('Splitting', async () => {
  var array = await interpret(`
    [1, 2, 3, 4, 5, 6, 7] | splitEvery 3 | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    { elements: [Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(2)), Promise.resolve(new KopiNumber(3))] },
    { elements: [Promise.resolve(new KopiNumber(4)), Promise.resolve(new KopiNumber(5)), Promise.resolve(new KopiNumber(6))] },
    { elements: [Promise.resolve(new KopiNumber(7))] },
  ]);

  var array = await interpret(`
      1..7 | splitEvery 3 | toArray
    `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    { elements: [Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(2)), Promise.resolve(new KopiNumber(3))] },
    { elements: [Promise.resolve(new KopiNumber(4)), Promise.resolve(new KopiNumber(5)), Promise.resolve(new KopiNumber(6))] },
    { elements: [Promise.resolve(new KopiNumber(7))] },
  ]);

  var array = await interpret(`
    "abcabca" | splitEvery 3 | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiString('abc'),
    new KopiString('abc'),
    new KopiString('a'),
  ]);

  var array = await interpret(`
    "abcabca" | map 'succ | splitEvery 3 | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiString('bcd'),
    new KopiString('bcd'),
    new KopiString('b'),
  ]);
});
