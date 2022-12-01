import * as parser from '../lib/parser';

import { transform, evaluateAst, environment } from '../compiler';
import { KopiString } from '../modules/terminals/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluateAst(transform(ast), environment, () => { });
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
