import { interpret } from '../compiler';

import { KopiDict, KopiNumber, KopiString, KopiTuple } from '../modules/terminals/classes';

describe('Tuple', () => {

  test('Basics', async () => {
    var tuple = await interpret(`
      (1, 2)
    `) as KopiTuple;

    expect(tuple).toEqual(new KopiTuple([
      Promise.resolve(new KopiNumber(1)),
      Promise.resolve(new KopiNumber(2)),
    ]));

    var tuple = await interpret(`
      (a: 1, b: 2)
    `) as KopiTuple;

    expect(tuple).toEqual(new KopiTuple([
      Promise.resolve(new KopiNumber(1)),
      Promise.resolve(new KopiNumber(2)),
    ], [
      'a',
      'b',
    ]));

    var dict = await interpret(`
      (1..3, "a".."z") | reduce (acc = {:}, n, c) => {
        acc | set c n
      }
    `) as KopiString;

    expect(dict).toEqual(new KopiDict([
      [new KopiString('a'), Promise.resolve(new KopiNumber(1))],
      [new KopiString('b'), Promise.resolve(new KopiNumber(2))],
      [new KopiString('c'), Promise.resolve(new KopiNumber(3))],
    ]));
  });

});
