import { interpret } from '../compiler';

import { KopiNumber, KopiTuple, KopiString, KopiRange, KopiArray, KopiBoolean } from '../modules/terminals/classes';

describe('Basic syntax', () => {

  test('Types', async () => {
    var tuple = await interpret(`
      (-123, "abc", true, 1..5, [1, 2])
    `) as KopiTuple;

    expect(await Promise.all(tuple.fields)).toEqual([
      new KopiNumber(-123),
      new KopiString('abc'),
      new KopiBoolean(true),
      new KopiRange(new KopiNumber(1), new KopiNumber(5)),
      new KopiArray([
        new KopiNumber(1), new KopiNumber(2)
      ])
    ]);

    var array = await interpret(`
      [123, "abc", true, "a".."c"] | toArray
    `) as KopiArray;

    expect(array).toEqual(new KopiArray([
      new KopiNumber(123),
      new KopiString('abc'),
      new KopiBoolean(true),
      new KopiRange(new KopiString('a'), new KopiString('c')),
    ]));
  });

  test('Async operations', async () => {
    var tuple = await interpret(`
      (sleep (sleep 1) + sleep 1, sleep 1 + sleep 1)
    `) as KopiTuple;

    expect(await Promise.all(tuple.fields)).toEqual([
      new KopiNumber(2),
      new KopiNumber(2),
    ]);
  });

  test('Math', async () => {
    var number = await interpret(`
      5 * 'sin 1 + 5 * 'cos 1
    `) as KopiNumber;

    expect(number.value).toBeCloseTo(6.908866453380181);
  });

  test('Function application', async () => {
    var number = await interpret(`
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
    var tuple = await interpret(`
      ((a, b = 2, c = 3) => (a, b, c)) (1)
    `) as KopiTuple;

    expect(await Promise.all(tuple.fields)).toEqual([
      new KopiNumber(1),
      new KopiNumber(2),
      new KopiNumber(3),
    ]);
  });

  test('Extension Methods', async () => {
    // var string = await interpret(`
    //   String ()
    // `) as KopiString;

    // expect(string.value).toEqual("Hello, world");

    var string = await interpret(`
      'capitalize "foo"
    `) as KopiString;

    expect(string.value).toEqual("FOO");
  });

  test('Block Expressions', async () => {
    var string = await interpret(`{

      (1, 2, 3)

      "abc"

    }`) as KopiString;

    expect(string.value).toEqual('abc');

    var number = await interpret(`
      ((a, b) => {

        a + b

      }) (1, 2)
    `) as KopiNumber;

    expect(number.value).toEqual(3);
  });

  test('Tuple Element Newlines', async () => {
    var tuple = await interpret(`
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
    var string = await interpret(`
      match 0 (
        0 => "Zero"
        1 => "One"
      )
    `) as KopiString;

    expect(string.value).toEqual('Zero');
  });

  test('Pipe', async () => {
    var string = await interpret(`"foo" | capitalize`) as KopiString;

    expect(string.value).toEqual('FOO');

    string = await interpret(`3.14149 | toFixed 2`) as KopiString;

    expect(string.value).toEqual('3.14');

    var number = await interpret(`1 | test 2 3`) as KopiNumber;

    expect(number.value).toEqual(9);
  });

  test('Fetch', async () => {
    var number = await interpret(`
      fetch "https://mike-austin.com" | size
    `) as KopiNumber;

    expect(number.value).toEqual(2138);
  });

  test('Assignment', async () => {
    var number = await interpret(`
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
    var number = await interpret(`
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
    var number = await interpret(`
      (1..5).to
    `) as KopiNumber;

    expect(number.value).toEqual(5);
  });

  test('FunctionPattern', async () => {
    var number = await interpret(`
      add (a, b) = a + b

      add (1, 2)
    `) as KopiNumber;

    expect(number.value).toEqual(3);
  });

  test('Named tuple fields', async () => {
    var tuple = await interpret(`
      tuple = (1, b: 2, c: 3)
      (tuple.0, tuple.1, tuple.2)
    `) as KopiTuple;

    expect(await Promise.all(tuple.fields)).toEqual([
      new KopiNumber(1),
      new KopiNumber(2),
      new KopiNumber(3),
    ]);

    tuple = await interpret(`
      tuple = (1, b: 2, c: 3)
      (tuple.b, tuple.c)
    `) as KopiTuple;

    expect(await Promise.all(tuple.fields)).toEqual([
      new KopiNumber(2),
      new KopiNumber(3),
    ]);
  });

  test('Context', async () => {
    var tuple = await interpret(`
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

});
