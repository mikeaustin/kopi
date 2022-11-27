import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiBoolean, KopiNumber } from '../modules/terminals/classes';

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
});
