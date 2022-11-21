import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiArray, KopiBoolean, KopiNumber, KopiStream, KopiString, KopiTuple } from '../modules/terminals/classes';
import { KopiRange } from '../modules/operators/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Basic types', async () => {
  var string = await interpret(`
    "foo" ++ "bar"
  `) as KopiString;

  expect(string).toEqual(new KopiString('foobar'));

  var boolean = await interpret(`
    (1, "2", [true, 'bar, 1..5]) == (1, "2", [true, 'bar, 1..5])
  `) as KopiString;

  expect(boolean).toEqual(new KopiBoolean(true));

  var boolean = await interpret(`
    (1, 2) == (1, 3)
  `) as KopiString;

  expect(boolean).toEqual(new KopiBoolean(false));

  var number = await interpret(`
    extend String (
      foo: (n) => n
    )

    "foo" | foo 5
  `) as KopiNumber;

  console.log(number);

  // var object = await interpret(`
  //   timer () | map (n) => n / 1000 | take 3 | each (n) => {
  //     print n
  //   }
  // `) as KopiStream;

  // var string = await interpret(`
  //   o = Observer 5

  //   oo = o | map (n) => {
  //     print "here"
  //     sleep 0.1
  //   }

  //   print "zzz 1"

  //   oo | take 2 | each (n) => print n

  //   print "zzz 2"

  //   o | set 10
  //   o | set 10
  // `) as KopiString;
});
