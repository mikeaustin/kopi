/* eslint-disable jest/no-conditional-expect */

import * as parser from './lib/parser';
import { transform, evaluate, environment } from './test';
import { KopiNumber, KopiTuple } from './modules2/terminals/classes';

test('Async operations', async () => {
  let ast = parser.parse(`(sleep (sleep 1) + sleep 1, sleep 1 + sleep 1)`);
  let value = await evaluate(transform(ast), environment);

  console.log(await value.inspect());

  expect(value).toBeInstanceOf(KopiTuple);

  if (value instanceof KopiTuple) {
    const elements = await Promise.all(value.elements);

    expect(elements).toEqual([
      new KopiNumber(2),
      new KopiNumber(2),
    ]);
  }
});

test('Trigonometry', async () => {
  let ast = parser.parse(`5 * 'sin 1 + 5 * 'cos 1`);
  let value = await evaluate(transform(ast), environment);

  console.log(await value.inspect());

  if (value instanceof KopiNumber) {
    expect(value.value).toBeCloseTo(6.908866453380181);
  }
});

test('Function application', async () => {
  let ast = parser.parse(`(x => x + 1) 3 + round 2.7`);
  let value = await evaluate(transform(ast), environment);

  console.log(await value.inspect());

  if (value instanceof KopiNumber) {
    expect(value.value).toBeCloseTo(7);
  }
});

test('Function application 2', async () => {
  let ast = parser.parse(`((a, b) => a + b) (1, 2)`);
  let value = await evaluate(transform(ast), environment);

  console.log(await value.inspect());

  if (value instanceof KopiNumber) {
    expect(value.value).toBeCloseTo(3);
  }
});

test('Function application 3', async () => {
  let ast = parser.parse(`((a, (b, c)) => (a + b) * c) (1, (2, 3))`);
  let value = await evaluate(transform(ast), environment);

  console.log(await value.inspect());

  if (value instanceof KopiNumber) {
    expect(value.value).toBeCloseTo(9);
  }
});
