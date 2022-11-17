import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiNumber, KopiString, KopiArray } from '../modules/terminals/classes';

async function interpret(source: string) {
  let ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('FizzBuzz', async () => {
  let array = await interpret(`
    fizzBuzz (n) = 1..n | map (n) => match (n % 3, n % 5) (
      (0, 0) => "FizzBuzz"
      (0, _) => "Fizz"
      (_, 0) => "Buzz"
      _      => n
    ) | toArray

    fizzBuzz 15
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(2),
    new KopiString('Fizz'),
    new KopiNumber(4),
    new KopiString('Buzz'),
    new KopiString('Fizz'),
    new KopiNumber(7),
    new KopiNumber(8),
    new KopiString('Fizz'),
    new KopiString('Buzz'),
    new KopiNumber(11),
    new KopiString('Fizz'),
    new KopiNumber(13),
    new KopiNumber(14),
    new KopiString('FizzBuzz'),
  ]);
});
