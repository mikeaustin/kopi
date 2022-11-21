import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiNumber, KopiStream, KopiDict, KopiBoolean, KopiArray } from '../modules/terminals/classes';

import KopiIterable from '../modules/operators/traits/KopiIterable';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Array', async () => {
  var number = await interpret(`
    [1, 2, 3] | has 1
  `) as KopiBoolean;

  expect(number).toEqual(new KopiBoolean(true));

  var number = await interpret(`
    [1, 2, 3] | has 3
  `) as KopiBoolean;

  expect(number).toEqual(new KopiBoolean(false));

  var number = await interpret(`
    [1, 2, 3] | includes 2
  `) as KopiBoolean;

  expect(number).toEqual(new KopiBoolean(true));

  var array = await interpret(`
    [1, 2, 3] | set 1 5
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(5),
    new KopiNumber(3),
  ]);

  var array = await interpret(`
    [1, 2, 3] | set 4 5
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(2),
    new KopiNumber(3),
    undefined,
    new KopiNumber(5),
  ]);

  var array = await interpret(`
    [1, 2, 3] | set (0..1) 5
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(5),
    new KopiNumber(3),
  ]);
});
