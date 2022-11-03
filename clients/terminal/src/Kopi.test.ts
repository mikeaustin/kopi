import * as parser from './lib/parser';

import { transform, evaluate, environment } from './test';
import { KopiNumber, KopiString, KopiTuple, KopiArray, KopiSequence } from './modules/terminals/classes';

async function interpret(source: string) {
  let ast = parser.parse(source);

  return evaluate(transform(ast), environment);
}

test('Basic types', async () => {
  let tuple = await interpret(`(123, "abc")`) as KopiTuple;

  expect(await Promise.all(tuple.elements)).toEqual([
    new KopiNumber(123),
    new KopiString("abc"),
  ]);
});

test('Async operations', async () => {
  let tuple = await interpret(`(sleep (sleep 1) + sleep 1, sleep 1 + sleep 1)`) as KopiTuple;

  expect(await Promise.all(tuple.elements)).toEqual([
    new KopiNumber(2),
    new KopiNumber(2),
  ]);
});

test('Trigonometry', async () => {
  let number = await interpret(`5 * 'sin 1 + 5 * 'cos 1`) as KopiNumber;

  expect(number.value).toBeCloseTo(6.908866453380181);
});

test('Function application', async () => {
  let number = await interpret(`(x => x + 1) 3 + 'round 2.7`) as KopiNumber;

  expect(number.value).toBeCloseTo(7);
});

test('Function application 2', async () => {
  let number = await interpret(`((a, b) => a + b) (1, 2)`) as KopiNumber;

  expect(number.value).toBeCloseTo(3);
});

test('Function application 3', async () => {
  let number = await interpret(`((a, (b, c)) => (a + b) * c) (1, (2, 3))`) as KopiNumber;

  expect(number.value).toBeCloseTo(9);
});

test('Function application 4', async () => {
  let tuple = await interpret(`((a, b) => (b, a)) (1, 2)`) as KopiTuple;

  expect(await Promise.all(tuple.elements)).toEqual([
    new KopiNumber(2),
    new KopiNumber(1),
  ]);
});

test('Function application 5', async () => {
  let number = await interpret(`((a, b) => c => (a + b) * c) (1, 2) 3`) as KopiNumber;

  expect(number.value).toEqual(9);
});

test('Function application 6', async () => {
  let tuple = await interpret(`print (1 + 2)`) as KopiTuple;

  expect(tuple).toEqual(new KopiTuple([]));
});

test('Default arguments', async () => {
  let tuple = await interpret(`((a, b = 2, c = 3) => (a, b, c)) (1)`) as KopiTuple;

  expect(await Promise.all(tuple.elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(2),
    new KopiNumber(3),
  ]);
});

test('Default arguments 2', async () => {
  let number = await interpret(`'size (1, 2, 3)`) as KopiNumber;

  expect(number.value).toEqual(3);
});

test('Default arguments 3', async () => {
  let string = await interpret(`String ()`) as KopiString;

  expect(string.value).toEqual("Hello, world");

  string = await interpret(`'capitalize "foo"`) as KopiString;

  expect(string.value).toEqual("FOO");
});

test('Statements', async () => {
  let string = await interpret(`

    (1, 2, 3)

    "abc"

`) as KopiString;

  expect(string.value).toEqual("abc");
});

test('Block Expressions', async () => {
  let string = await interpret(`  (() => {

    (1, 2, 3)

    "abc"

  }) ()`) as KopiString;

  expect(string.value).toEqual("abc");
});

test('Block Expressions 2', async () => {
  let string = await interpret(`
    ((a, b) => {

      a + b

    }) (1, 2)
  `) as KopiNumber;

  expect(string.value).toEqual(3);
});

test('Tuple Element Newlines', async () => {
  let tuple = await interpret(`
    (

      ((a, b) => a + b) (0, 1)

      0 + 1 + 1,

      3

    )`) as KopiTuple;

  expect(await Promise.all((tuple as KopiTuple).elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(2),
    new KopiNumber(3),
  ]);
});

test('match', async () => {
  let string = await interpret(`
    match 0 (
      0 => "Zero"
      1 => "One"
    )
  `) as KopiString;

  expect(string.value).toEqual("Zero");
});

test('Pipe', async () => {
  let string = await interpret(`"foo" | capitalize`) as KopiString;

  expect(string.value).toEqual("FOO");
});

test('Pipe 2', async () => {
  let string = await interpret(`3.14149 | toFixed 2`) as KopiString;

  expect(string.value).toEqual("3.14");
});

test('Pipe 3', async () => {
  let number = await interpret(`1 | test 2 3`) as KopiNumber;

  expect(number.value).toEqual(9);
});

test('Range', async () => {
  let sequence = await interpret(`1..3 | map (n) => n * n`) as KopiSequence;

  const elements = (await sequence.toArray()).elements;

  expect(await Promise.all(elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(4),
    new KopiNumber(9),
  ]);
});

test('Fetch', async () => {
  let number = await interpret(`fetch "https://mike-austin.com" | length`) as KopiNumber;

  console.log(await number.inspect());

  expect(number.value).toEqual(2138);
});
