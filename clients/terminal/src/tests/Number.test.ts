import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiBoolean, KopiNumber, KopiString } from '../modules/terminals/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

describe('Number', () => {

  test('Math', async () => {
    var number = await interpret(`
      2 + 3
    `) as KopiNumber;

    expect(number).toEqual(new KopiNumber(5));

    var number = await interpret(`
      2 + 3 * 5 / 2
    `) as KopiNumber;

    expect(number).toEqual(new KopiNumber(9.5));

    var number = await interpret(`
      (2 + 3) * 5 / 2
    `) as KopiNumber;

    expect(number).toEqual(new KopiNumber(12.5));

    var number = await interpret(`
      4 % 2
    `) as KopiNumber;

    expect(number).toEqual(new KopiNumber(0));

    var number = await interpret(`
      5 % 2
    `) as KopiNumber;

    expect(number).toEqual(new KopiNumber(1));

    var number = await interpret(`
      'round 2.5
    `) as KopiNumber;

    expect(number).toEqual(new KopiNumber(3));
  });

  test('Relational', async () => {
    var boolean = await interpret(`
      3 == 3
    `) as KopiBoolean;

    expect(boolean).toEqual(new KopiBoolean(true));

    var boolean = await interpret(`
      3 != 3
    `) as KopiBoolean;

    expect(boolean).toEqual(new KopiBoolean(false));

    var boolean = await interpret(`
      2 < 3
    `) as KopiBoolean;

    expect(boolean).toEqual(new KopiBoolean(true));

    var boolean = await interpret(`
      2 > 3
    `) as KopiBoolean;

    expect(boolean).toEqual(new KopiBoolean(false));

    var boolean = await interpret(`
      3 <= 3
    `) as KopiBoolean;

    expect(boolean).toEqual(new KopiBoolean(true));

    var boolean = await interpret(`
      3 >= 3
    `) as KopiBoolean;

    expect(boolean).toEqual(new KopiBoolean(true));
  });

  test('Trig', async () => {
    var number = await interpret(`
      'sin 0
    `) as KopiNumber;

    expect(number.value).toBeCloseTo(0);

    var number = await interpret(`
      'cos 0
    `) as KopiNumber;

    expect(number.value).toBeCloseTo(1);
  });

  test('Misc', async () => {
    var number = await interpret(`
      3.14159 | toFixed 2
    `) as KopiNumber;

    expect(number).toEqual(new KopiString('3.14'));
  });

});
