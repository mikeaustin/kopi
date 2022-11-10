import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiNumber, KopiString, KopiTuple, KopiArray, KopiStream, KopiBoolean } from '../modules/terminals/classes';

async function interpret(source: string) {
  let ast = parser.parse(source);

  return evaluate(transform(ast), environment);
}

test('Factorial', async () => {
  let number = await interpret(`
    fix = f => (x => f (y => x x y)) x => f (y => x x y)

    factorial = fix factorial => n => match n (
      0 => 1
      n => n * factorial (n - 1)
    )

    factorial 5
  `) as KopiNumber;

  expect(number.value).toEqual(120);

  number = await interpret(`
    factorial (n) = match n (
      0 => 1
      n => n * factorial (n - 1)
    )

    factorial 5
  `) as KopiNumber;

  expect(number.value).toEqual(120);
});
