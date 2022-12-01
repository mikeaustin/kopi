import * as parser from '../lib/parser';

import { transform, evaluateAst, environment } from '../compiler';
import { KopiBoolean, KopiNumber } from '../modules/terminals/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluateAst(transform(ast), environment, () => { });
}

test('Boolean', async () => {
  var boolean = await interpret(`
    'even 2
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));

  var boolean = await interpret(`
    !('even 2)
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(false));

  var boolean = await interpret(`
    !!('even 2)
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));
});
