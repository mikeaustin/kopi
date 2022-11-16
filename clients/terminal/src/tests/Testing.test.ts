import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiStream } from '../modules/terminals/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Iterable', async () => {
  var stream = await interpret(`
    [1, 2, 3, 4, 5, 6, 7] | splitEvery 3
  `) as KopiStream;

  console.log(await stream.inspect());

  stream = await interpret(`
    1..7 | splitEvery 3
  `) as KopiStream;

  console.log(await stream.inspect());

  stream = await interpret(`
    "abcabca" | splitEvery 3
  `) as KopiStream;

  console.log(await stream.inspect());
});
