/* eslint-disable jest/no-conditional-expect */

import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../test';
import { KopiNumber, KopiString, KopiTuple, KopiArray, KopiStream, KopiBoolean } from '../modules/terminals/classes';
import { KopiRange } from '../modules/operators/classes';

async function interpret(source: string) {
  let ast = parser.parse(source);

  return evaluate(transform(ast), environment);
}

test('Range', async () => {
  let stream = await interpret(`1..5 | map (n) => n * n | filter (n) => 'even n`) as KopiStream;

  const elements = (await stream.toArray()).elements;

  expect(await Promise.all(elements)).toEqual([
    new KopiNumber(4),
    new KopiNumber(16),
  ]);

  let array = await interpret(`1..3 | map (n) => n * n | toArray`) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(4),
    new KopiNumber(9),
  ]);

  array = await interpret(`"a".."c" | map (c) => c | toArray`) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiString("a"),
    new KopiString("b"),
    new KopiString("c"),
  ]);
});

test('Map and filter', async () => {
  let stream = await interpret(`(1..5, "a".."z") | map (n, c) => (c, n * n) | filter (c, n) => 'even n`) as KopiStream;

  expect(await Promise.all((await stream.toArray()).elements)).toEqual([
    new KopiTuple([Promise.resolve(new KopiString('b')), Promise.resolve(new KopiNumber(4))]),
    new KopiTuple([Promise.resolve(new KopiString('a')), Promise.resolve(new KopiNumber(16))]),
  ]);

  let array = await interpret(`
    1..3 | flatMap a => ((a + 1)..3 | map b => (a, b)) | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiTuple([Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(2))]),
    new KopiTuple([Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(3))]),
    new KopiTuple([Promise.resolve(new KopiNumber(2)), Promise.resolve(new KopiNumber(3))]),
  ]);

  stream = await interpret(`1..1000000000 | map (n) => (n * n) | take 3`) as KopiStream;

  expect(await Promise.all((await stream.toArray()).elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(4),
    new KopiNumber(9),
  ]);

  let number = await interpret(`1..2 | find (n) => 'even n`) as KopiNumber | KopiTuple;

  if (number instanceof KopiNumber) {
    expect(number.value).toEqual(2);
  }

  number = await interpret(`1..5 | reduce (a = 1, n) => (a * n)`) as KopiNumber;

  expect(number.value).toEqual(120);
});

test('Take and drop', async () => {
  let array = await interpret(`
    1..5 | drop 3 | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(4),
    new KopiNumber(5),
  ]);

  let boolean = await interpret(`
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
