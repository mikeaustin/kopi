import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiArray, KopiBoolean, KopiNumber, KopiStream, KopiString, KopiTuple } from '../modules/terminals/classes';
import { KopiRange } from '../modules/operators/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Basic types', async () => {
  let string = await interpret(`
    "foo" ++ "bar"
  `) as KopiString;

  expect(string).toEqual(new KopiString('foobar'));
});
