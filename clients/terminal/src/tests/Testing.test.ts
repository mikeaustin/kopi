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

  var object = await interpret(`
    timer () | map (n) => n / 1000 | take 3 | each (n) => {
      print n
    }
  `) as KopiStream;

  console.log(object);

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

  console.log('Done.');
});
