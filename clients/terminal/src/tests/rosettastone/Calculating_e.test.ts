import * as parser from '../../lib/parser';

import { transform, evaluate, environment } from '../../compiler';
import { KopiArray, KopiBoolean, KopiNumber, KopiStream, KopiString, KopiTuple } from '../../modules/terminals/classes';
import { KopiRange } from '../../modules/operators/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Roseta Code', async () => {
  await interpret(`
    e1 = 1..1000 | reduce ((e = 1, f = 1), i) => (e: e  + 1 / (f * i), f: f * i)

    e2 = let (i = 1, f = 1, e = 1) => {
      f = f * i
      e = e + 1 / f

      match i (
        1000 => e
        _    => loop (i + 1, f, e)
      )
    }

    print e1.e
    print e2
  `) as KopiString;
});
