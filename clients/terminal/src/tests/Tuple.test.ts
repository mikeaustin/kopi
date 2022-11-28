import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiArray, KopiBoolean, KopiNumber, KopiStream, KopiString, KopiTuple } from '../modules/terminals/classes';
import { KopiRange } from '../modules/operators/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Basic types', async () => {
  var string = await interpret(`
    (0..5, "a".."e") | reduce (acc = {:}, n, c) => {
      acc | set c n
    }
  `) as KopiString;

  console.log(await string.inspect());
  // expect(string).toEqual(new KopiString('foobar'));
});
