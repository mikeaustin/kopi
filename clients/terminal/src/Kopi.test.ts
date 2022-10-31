import * as parser from './lib/parser';

import { transform, evaluate, environment } from './test';
import { KopiNumber, KopiString, KopiTuple } from './modules2/terminals/classes';

async function interpret(source: string) {
  let ast = parser.parse(source);

  return evaluate(transform(ast), environment);
}

// test('Basic types', async () => {
//   let value = await interpret(`(123, "abc")`) as KopiTuple;

//   expect(await Promise.all(value.elements)).toEqual([
//     new KopiNumber(123),
//     new KopiString("abc"),
//   ]);
// });

// test('Async operations', async () => {
//   let value = await interpret(`(sleep (sleep 1) + sleep 1, sleep 1 + sleep 1)`) as KopiTuple;

//   expect(await Promise.all(value.elements)).toEqual([
//     new KopiNumber(2),
//     new KopiNumber(2),
//   ]);
// });

// test('Trigonometry', async () => {
//   let value = await interpret(`5 * 'sin 1 + 5 * 'cos 1`) as KopiNumber;

//   expect(value.value).toBeCloseTo(6.908866453380181);
// });

// test('Function application', async () => {
//   let value = await interpret(`(x => x + 1) 3 + 'round 2.7`) as KopiNumber;

//   expect(value.value).toBeCloseTo(7);
// });

// test('Function application 2', async () => {
//   let value = await interpret(`((a, b) => a + b) (1, 2)`) as KopiNumber;

//   expect(value.value).toBeCloseTo(3);
// });

// test('Function application 3', async () => {
//   let value = await interpret(`((a, (b, c)) => (a + b) * c) (1, (2, 3))`) as KopiNumber;

//   expect(value.value).toBeCloseTo(9);
// });

// test('Function application 4', async () => {
//   let value = await interpret(`((a, b) => (b, a)) (1, 2)`) as KopiTuple;

//   expect(await Promise.all((value as KopiTuple).elements)).toEqual([
//     new KopiNumber(2),
//     new KopiNumber(1),
//   ]);
// });

// test('Default arguments', async () => {
//   let value = await interpret(`((a, b = 2, c = 3) => (a, b, c)) (1)`) as KopiTuple;

//   expect(await Promise.all((value as KopiTuple).elements)).toEqual([
//     new KopiNumber(1),
//     new KopiNumber(2),
//     new KopiNumber(3),
//   ]);
// });

// test('Default arguments 2', async () => {
//   let value = await interpret(`'size (1, 2, 3)`) as KopiNumber;

//   expect(value.value).toEqual(3);
// });

test('Default arguments 3', async () => {
  let value = await interpret(`String ()`) as KopiString;

  expect(value.value).toEqual("Hello, world");

  value = await interpret(`'capitalize "foo"`) as KopiString;

  expect(value.value).toEqual("FOO");
});
