import * as parser from '../lib/parser';

import { transform, evaluateAst, environment } from '../compiler';
import { KopiString } from '../modules/terminals/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluateAst(transform(ast), environment, () => { });
}

describe('String', () => {

  test('Get', async () => {
    var string = await interpret(`
      "foo".(0)
    `) as KopiString;

    expect(string).toEqual(new KopiString('f'));

    var string = await interpret(`
      "𝒽𝑒𝓁𝓁𝑜".([1, 2, 0])
    `) as KopiString;

    expect(string).toEqual(new KopiString('𝑒𝓁𝒽'));

    var string = await interpret(`
      "foo".(1..3)
    `) as KopiString;

    expect(string).toEqual(new KopiString('oo'));
  });

  test('Set', async () => {
    var string = await interpret(`
      "foo".(0, "b")
    `) as KopiString;

    expect(string).toEqual(new KopiString('boo'));

    var string = await interpret(`
      "𝒽𝑒𝓁𝓁𝑜".(2..4, "𝓇")
    `) as KopiString;

    expect(string).toEqual(new KopiString('𝒽𝑒𝓇𝑜'));

    var string = await interpret(`
      str = "𝒽𝑒𝓁𝓁𝑜"
      str.(3..5, str.([4, 3]))
    `) as KopiString;

    expect(string).toEqual(new KopiString('𝒽𝑒𝓁𝑜𝓁'));

    var string = await interpret(`
      "foo" | set 0 "b"
    `) as KopiString;

    expect(string).toEqual(new KopiString('boo'));

    var string = await interpret(`
      "𝒽𝑒𝓁𝓁𝑜" | set 2..4 "𝓇"
    `) as KopiString;

    expect(string).toEqual(new KopiString('𝒽𝑒𝓇𝑜'));
  });

  test('Apply', async () => {
    var string = await interpret(`
      "foo" 0
    `) as KopiString;

    expect(string).toEqual(new KopiString('f'));

    var string = await interpret(`
      "𝒽𝑒𝓁𝓁𝑜" [1, 2, 0]
    `) as KopiString;

    expect(string).toEqual(new KopiString('𝑒𝓁𝒽'));

    var string = await interpret(`
      "foo" 1..3
    `) as KopiString;

    expect(string).toEqual(new KopiString('oo'));

    var string = await interpret(`
      "foo" 3..0
    `) as KopiString;

    expect(string).toEqual(new KopiString('oof'));
  });

});
