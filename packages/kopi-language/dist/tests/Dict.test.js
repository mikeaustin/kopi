var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { interpret } from '../compiler';
import { KopiNumber, KopiDict, KopiBoolean, KopiString } from '../modules/terminals/classes';
test('Dict', () => __awaiter(void 0, void 0, void 0, function* () {
    var number = yield interpret(`
    dict = { "a": 1, "b": 2 }
    dict | get "b"
  `);
    expect(number.value).toEqual(2);
    number = (yield interpret(`
    dict = {:}
    dict = dict | set "c" 3
    dict | get "c"
  `));
    expect(number.value).toEqual(3);
    var boolean = yield interpret(`
    { "a": 1, "b": 2 } | has "a"
  `);
    expect(boolean).toEqual(new KopiBoolean(true));
    var boolean = yield interpret(`
    { "a": 1, "b": 2 } | has "C"
  `);
    expect(boolean).toEqual(new KopiBoolean(false));
    number = (yield interpret(`
    dict = { "a": 1 }
    dict = dict | update "a" (n = 0) => n + 1
    dict | get "a"
  `));
    expect(number.value).toEqual(2);
    var dict = yield interpret(`
    "a b c a b a" | split " " | reduce (counts = {:}, word) => {
      counts | update word (n = 0) => n + 1
    }
  `);
    expect(dict).toEqual(new KopiDict([
        [new KopiString('a'), Promise.resolve(new KopiNumber(3))],
        [new KopiString('b'), Promise.resolve(new KopiNumber(2))],
        [new KopiString('c'), Promise.resolve(new KopiNumber(1))],
    ]));
    var dict = yield interpret(`
    { "a": 1, "b": 2 } | map (k, v) => (k, v + 1) | toDict
  `);
    expect(dict).toEqual(new KopiDict([
        [new KopiString('a'), Promise.resolve(new KopiNumber(2))],
        [new KopiString('b'), Promise.resolve(new KopiNumber(3))],
    ]));
    var dict = yield interpret(`
    (1..3, "a".."z") | reduce (dict = {:}, n, c) => {
      dict | merge { (c): n }
    }
  `);
    expect(dict).toEqual(new KopiDict([
        [new KopiString('a'), Promise.resolve(new KopiNumber(1))],
        [new KopiString('b'), Promise.resolve(new KopiNumber(2))],
        [new KopiString('c'), Promise.resolve(new KopiNumber(3))],
    ]));
}));
