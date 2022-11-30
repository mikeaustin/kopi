import * as parser from '../../lib/parser';

import { transform, evaluate, environment } from '../../compiler';
import { KopiArray, KopiBoolean, KopiNumber, KopiTuple } from '../../modules/terminals/classes';
import { KopiRange } from '../../modules/operators/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Calculating E', async () => {
  var tuple = await interpret(`
    e1 = 1..17 | reduce ((e = 1, f = 1), i) =>
      let (f = f * i) => (e + 1 / f, f)

    print e1.0

    e2 = let (i = 1, f = 1, e = 1) => {
      f = f * i
      e = e + 1 / f

      match i (
        17 => e
        _    => loop (i + 1, f, e)
      )
    }

    print e2

    (e1.0, e2)
  `) as KopiTuple;

  const fields = await Promise.all(tuple.fields) as [KopiNumber, KopiNumber];

  expect(fields[0].value).toBeCloseTo(2.7182818284590455);
  expect(fields[1].value).toBeCloseTo(2.7182818284590455);
});
