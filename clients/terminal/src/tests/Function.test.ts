import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiNumber } from '../modules/terminals/classes';

async function interpret(source: string) {
  let ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

expect.extend({
  toBeEquivalent(received, expected) {
    return this.equals(JSON.stringify(received), JSON.stringify(expected))
      ? { pass: true, message: () => '' }
      : { pass: false, message: () => '' };
  }
});

test('Factorial', async () => {
  let number = await interpret(`
    fix = f => (x => f (y => x x y)) x => f (y => x x y)

    factorial = fix factorial => n => match n (
      0 => 1
      n => n * factorial (n - 1)
    )

    factorial 5
  `) as KopiNumber;

  expect(number.value).toBeEquivalent(120);

  number = await interpret(`
    factorial (n) = match n (
      0 => 1
      n => n * factorial (n - 1)
    )

    factorial 5
  `) as KopiNumber;

  expect(number.value).toBeEquivalent(120);
});
