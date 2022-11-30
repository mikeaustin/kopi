import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiNumber, KopiStream, KopiDict, KopiBoolean } from '../modules/terminals/classes';

import KopiIterable from '../modules/operators/traits/KopiIterable';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Dict', async () => {
  var number = await interpret(`
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

  var boolean = await interpret(`
    { "a": 1, "b": 2 } | has "a"
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));

  var boolean = await interpret(`
    { "a": 1, "b": 2 } | has "C"
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(false));

  number = await interpret(`
    dict = { "a": 1 }
    dict = dict | update "a" (n = 0) => n + 1
    dict | get "a"
  `) as KopiNumber;

  expect(number.value).toEqual(2);

  var dict = await interpret(`
    "a b c a b a" | split " " | reduce (counts = {:}, word) => {
      counts | update word (n = 0) => n + 1
    }
  `) as KopiDict;

  console.log(await dict.inspect());

  var dict = await interpret(`
    { "a": 1, "b": 2 } | map (k, v) => (k, v + 1) | toDict
  `) as KopiDict;

  console.log(await dict.inspect());

  var dict = await interpret(`
    (1..3, "a".."z") | reduce (dict = {:}, n, c) => {
      dict | merge { (c): n }
    }
  `) as KopiDict;

  console.log(await dict.inspect());
});
