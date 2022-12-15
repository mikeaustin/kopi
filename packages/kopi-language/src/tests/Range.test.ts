import { interpret } from '../compiler';

import { KopiNumber, KopiArray, KopiString } from '../modules/terminals/classes';

test('Array', async () => {
  var array = await interpret(`
  (1..5 2) | toArray
`) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(3),
    new KopiNumber(5),
  ]);

  array = await interpret(`
  ("a".."z" 2) | take 3 | toArray
`) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiString('a'),
    new KopiString('c'),
    new KopiString('e'),
  ]);

  var array = await interpret(`
    -1..1 | map (n) => n + 2 | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(2),
    new KopiNumber(3),
  ]);
});
