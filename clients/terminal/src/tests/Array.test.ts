import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiNumber, KopiStream, KopiDict, KopiBoolean, KopiArray, KopiTuple, KopiString } from '../modules/terminals/classes';

import KopiIterable from '../modules/operators/traits/KopiIterable';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Array', async () => {
  var number = await interpret(`
    'size [1, 2, 3]
  `) as KopiNumber;

  expect(number.value).toEqual(3);

  var boolean = await interpret(`
    [1, 2, 3] | has 1
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));

  var boolean = await interpret(`
    [1, 2, 3] | has 3
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(false));


  var boolean = await interpret(`
    [1, 2, 3] | includes 2
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));


  var number = await interpret(`
    [1, 2, 3] 1
  `) as KopiBoolean;

  expect(number).toEqual(new KopiNumber(2));

  var array = await interpret(`
    [1, 2, 3] [1, 2]
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(2),
    new KopiNumber(3),
  ]);

  var array = await interpret(`
    [1, 2, 3] 1..3
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(2),
    new KopiNumber(3),
  ]);


  var number = await interpret(`
    [1, 2, 3] | get 1
  `) as KopiBoolean;

  expect(number).toEqual(new KopiNumber(2));

  var number = await interpret(`
    [1, 2, 3] | get 3
  `) as KopiBoolean;

  expect(number).toEqual(KopiTuple.empty);


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

  var array = await interpret(`
    [1, 2, 3] | update 1 (n) => n + 3
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(5),
    new KopiNumber(3),
  ]);

  var string = await interpret(`
    ["a", "b", "c"] | joinWith ", "
  `) as KopiString;

  expect(string).toEqual(
    new KopiString('a, b, c')
  );
});
