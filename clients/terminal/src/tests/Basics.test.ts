import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiNumber, KopiString, KopiTuple, KopiArray, KopiBoolean, KopiDict } from '../modules/terminals/classes';
import { KopiRange } from '../modules/operators/classes';

async function interpret(source: string) {
  let ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Basic types', async () => {
  let tuple = await interpret(`
    (-123, "abc", true, 1..5)
  `) as KopiTuple;

  expect(await Promise.all(tuple.fields)).toEqual([
    new KopiNumber(-123),
    new KopiString("abc"),
    new KopiBoolean(true),
    new KopiRange(Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(5))),
  ]);

  let array = await interpret(`
    [123, "abc", true, "a".."c"]
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(123),
    new KopiString("abc"),
    new KopiBoolean(true),
    new KopiRange(Promise.resolve(new KopiString('a')), Promise.resolve(new KopiString('c'))),
  ]);

  let number = await interpret(`
    'size (1, 2, 3)
  `) as KopiNumber;

  expect(number.value).toEqual(3);
});

test('Async operations', async () => {
  let tuple = await interpret(`
    (sleep (sleep 1) + sleep 1, sleep 1 + sleep 1)
  `) as KopiTuple;

  expect(await Promise.all(tuple.fields)).toEqual([
    new KopiNumber(2),
    new KopiNumber(2),
  ]);
});

test('Math', async () => {
  let number = await interpret(`
    5 * 'sin 1 + 5 * 'cos 1
  `) as KopiNumber;

  expect(number.value).toBeCloseTo(6.908866453380181);
});

test('Function application', async () => {
  let number = await interpret(`
    (x => x + 1) 3 + 'round 2.7
  `) as KopiNumber;

  expect(number.value).toBeCloseTo(7);

  number = await interpret(`
    ((a, b) => a + b) (1, 2)
  `) as KopiNumber;

  expect(number.value).toBeCloseTo(3);

  number = await interpret(`
    ((a, (b, c)) => (a + b) * c) (1, (2, 3))
  `) as KopiNumber;

  expect(number.value).toBeCloseTo(9);

  number = await interpret(`
    ((a, b) => c => (a + b) * c) (1, 2) 3
  `) as KopiNumber;

  expect(number.value).toEqual(9);
});

test('Default arguments', async () => {
  let tuple = await interpret(`
    ((a, b = 2, c = 3) => (a, b, c)) (1)
  `) as KopiTuple;

  expect(await Promise.all(tuple.fields)).toEqual([
    new KopiNumber(1),
    new KopiNumber(2),
    new KopiNumber(3),
  ]);
});

test('Extension Methods', async () => {
  // let string = await interpret(`
  //   String ()
  // `) as KopiString;

  // expect(string.value).toEqual("Hello, world");

  let string = await interpret(`
    'capitalize "foo"
  `) as KopiString;

  expect(string.value).toEqual("FOO");
});

test('Block Expressions', async () => {
  let string = await interpret(`{

    (1, 2, 3)

    "abc"

  }`) as KopiString;

  expect(string.value).toEqual("abc");

  let number = await interpret(`
    ((a, b) => {

      a + b

    }) (1, 2)
  `) as KopiNumber;

  expect(number.value).toEqual(3);
});

test('Tuple Element Newlines', async () => {
  let tuple = await interpret(`
    (

      ((a, b) => a + b) (0, 1)

      0 + 1 + 1,

      3

    )
  `) as KopiTuple;

  expect(await Promise.all(tuple.fields)).toEqual([
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

  string = await interpret(`3.14149 | toFixed 2`) as KopiString;

  expect(string.value).toEqual("3.14");

  let number = await interpret(`1 | test 2 3`) as KopiNumber;

  expect(number.value).toEqual(9);
});

test('Fetch', async () => {
  let number = await interpret(`
    fetch "https://mike-austin.com" | length
  `) as KopiNumber;

  expect(number.value).toEqual(2138);
});

test('Assignment', async () => {
  let number = await interpret(`
    a = 1
    b = 2

    a + b
  `) as KopiNumber;

  expect(number.value).toEqual(3);

  number = await interpret(`
    z = 1
    f = x => x + z
    x = 2

    f 2
  `) as KopiNumber;

  expect(number.value).toEqual(3);
});

test('Loop', async () => {
  let number = await interpret(`
    let (n = 1) => {
      sleep 0.5
      # print n

      match (n) (
        3 => 3
        n => loop (n + 1)
      )
    }
  `) as KopiNumber;

  expect(number.value).toEqual(3);
});

test('Member', async () => {
  let number = await interpret(`
    (1..5).to
  `) as KopiNumber;

  expect(number.value).toEqual(5);

  let array = await interpret(`
    (1..5 2) | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiNumber(1),
    new KopiNumber(3),
    new KopiNumber(5),
  ]);

  array = await interpret(`
    ("a".."z" 2) | take 3 | toArray
  `) as KopiArray;

  expect(await Promise.all(array.elements)).toEqual([
    new KopiString('a'),
    new KopiString('c'),
    new KopiString('e'),
  ]);
});

test('FunctionPattern', async () => {
  let number = await interpret(`
    add (a, b) = a + b

    add (1, 2)
  `) as KopiNumber;

  expect(number.value).toEqual(3);
});

test('Named tuple fields', async () => {
  let tuple = await interpret(`
    tuple = (1, b: 2, c: 3)
    (tuple.0, tuple.1, tuple.2)
  `) as KopiTuple;

  console.log(await tuple.inspect());

  tuple = await interpret(`
    tuple = (1, b: 2, c: 3)
    (tuple.b, tuple.c)
  `) as KopiTuple;

  console.log(await tuple.inspect());
});

test('Context', async () => {
  let tuple = await interpret(`
    columnWidth = context 80

    (
      columnWidth | get,
      {
        columnWidth | set 120
        columnWidth | get
      },
      columnWidth | get
    )
  `) as KopiTuple;

  expect(await Promise.all(tuple.fields)).toEqual([
    new KopiNumber(80),
    new KopiNumber(120),
    new KopiNumber(80),
  ]);
});

test('Dict', async () => {
  let number = await interpret(`
    dict = { "a": 1, "b": 2 }
    dict | get "b"
  `) as KopiNumber;

  expect(number.value).toEqual(2);

  number = await interpret(`
    dict = {:}
    dict = dict | set "c" 3
    dict | get "c"
  `) as KopiNumber;

  expect(number.value).toEqual(3);

  number = await interpret(`
    dict = { "a": 1 }
    dict = dict | update "a" (n = 0) => n + 1
    dict | get "a"
  `) as KopiNumber;

  expect(number.value).toEqual(2);

  let dict = await interpret(`
    "a b c a b a" | split " " | reduce (counts = {:}, word) => {
      counts | update word (n = 0) => n + 1
    }
  `) as KopiDict;

  console.log(await dict.inspect());
});

test('User Type', async () => {
  let number = await interpret(`
    Person = type (name: String, age: String)

    Person (name: "Joe", age: 30)
  `) as KopiNumber;

  console.log(number);
});
