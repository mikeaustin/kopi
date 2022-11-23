import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiArray, KopiBoolean, KopiNumber, KopiStream, KopiString, KopiTuple } from '../modules/terminals/classes';
import { KopiRange } from '../modules/operators/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('String', async () => {
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
});
