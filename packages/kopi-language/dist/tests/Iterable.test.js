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
import { KopiNumber, KopiString, KopiTuple, KopiArray, KopiBoolean } from '../modules/terminals/classes';
test('Range', () => __awaiter(void 0, void 0, void 0, function* () {
    var array = yield interpret(`
    1..5 | map (n) => n * n | filter (n) => 'even n | toArray
  `);
    expect(array).toEqual(new KopiArray([
        new KopiNumber(4),
        new KopiNumber(16),
    ]));
    var array = yield interpret(`
    1..3 | map (n) => n * n | toArray
  `);
    expect(array).toEqual(new KopiArray([
        new KopiNumber(1),
        new KopiNumber(4),
        new KopiNumber(9),
    ]));
    array = (yield interpret(`
    "a".."c" | map (c) => c | toArray
  `));
    expect(array).toEqual(new KopiArray([
        new KopiString("a"),
        new KopiString("b"),
        new KopiString("c"),
    ]));
    array = (yield interpret(`
    "a".."c" | cycle | take 7 | toArray
  `));
    expect(array).toEqual(new KopiArray([
        new KopiString("a"),
        new KopiString("b"),
        new KopiString("c"),
        new KopiString("a"),
        new KopiString("b"),
        new KopiString("c"),
        new KopiString("a"),
    ]));
}));
test('Map and filter', () => __awaiter(void 0, void 0, void 0, function* () {
    var array = yield interpret(`
    (1..5, "a".."z") | map (n, c) => (c, n * n) | filter (c, n) => 'even n | toArray
  `);
    expect(array).toEqual(new KopiArray([
        new KopiTuple([Promise.resolve(new KopiString('b')), Promise.resolve(new KopiNumber(4))]),
        new KopiTuple([Promise.resolve(new KopiString('a')), Promise.resolve(new KopiNumber(16))]),
    ]));
    var array = yield interpret(`
    1..3 | flatMap a => ((a + 1)..3 | map b => (a, b)) | toArray
  `);
    expect(array).toEqual(new KopiArray([
        new KopiTuple([Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(2))]),
        new KopiTuple([Promise.resolve(new KopiNumber(1)), Promise.resolve(new KopiNumber(3))]),
        new KopiTuple([Promise.resolve(new KopiNumber(2)), Promise.resolve(new KopiNumber(3))]),
    ]));
    var array = yield interpret(`
    1..3 | flatMap a => a * a | toArray
  `);
    expect(array).toEqual(new KopiArray([
        new KopiNumber(1),
        new KopiNumber(4),
        new KopiNumber(9),
    ]));
    var array = yield interpret(`
    1..1000000000 | map (n) => (n * n) | take 3 | toArray
  `);
    expect(array).toEqual(new KopiArray([
        new KopiNumber(1),
        new KopiNumber(4),
        new KopiNumber(9),
    ]));
    var number = yield interpret(`
    1..2 | find (n) => 'even n
  `);
    expect(number.value).toEqual(2);
    var number = yield interpret(`
    1..5 | reduce (a = 1, n) => a * n
  `);
    expect(number.value).toEqual(120);
    var array = yield interpret(`
    1..3 | scan (a = 1, n) => a * n | toArray
  `);
    expect(array).toEqual(new KopiArray([
        new KopiNumber(1),
        new KopiNumber(2),
        new KopiNumber(6),
    ]));
    var boolean = yield interpret(`
    1..5 | includes 3
  `);
    expect(boolean).toEqual(new KopiBoolean(true));
    var boolean = yield interpret(`
    1..5 | includes 7
  `);
    expect(boolean).toEqual(new KopiBoolean(false));
    var boolean = yield interpret(`
    "a".."e" | includes "c"
  `);
    expect(boolean).toEqual(new KopiBoolean(true));
    var boolean = yield interpret(`
    "a".."e" | includes "g"
  `);
    expect(boolean).toEqual(new KopiBoolean(false));
    var boolean = yield interpret(`
    [1, 2, 3, 4, 5] | includes 3
  `);
    expect(boolean).toEqual(new KopiBoolean(true));
    var boolean = yield interpret(`
    [1, 2, 3, 4, 5] | includes 7
  `);
    expect(boolean).toEqual(new KopiBoolean(false));
    var boolean = yield interpret(`
    "abcde" | includes "c"
  `);
    expect(boolean).toEqual(new KopiBoolean(true));
    var boolean = yield interpret(`
    1..5 | filter 'odd | includes 3
  `);
    expect(boolean).toEqual(new KopiBoolean(true));
    var number = yield interpret(`
    1..5 | count (n) => 'odd n
  `);
    expect(number).toEqual(new KopiNumber(3));
}));
test('Take and skip', () => __awaiter(void 0, void 0, void 0, function* () {
    var array = yield interpret(`
    1..5 | skip 3 | toArray
  `);
    expect(array).toEqual(new KopiArray([
        new KopiNumber(4),
        new KopiNumber(5),
    ]));
    var boolean = yield interpret(`
    [1, 3, 5] | some (n) => 'even n
  `);
    expect(boolean.value).toEqual(false);
    boolean = (yield interpret(`
    [1, 2, 3, 4, 5] | some (n) => 'even n
  `));
    expect(boolean.value).toEqual(true);
    array = (yield interpret(`
    iterate 1 (n) => n * 2 | take 3 | toArray
  `));
    expect(array).toEqual(new KopiArray([
        new KopiNumber(2),
        new KopiNumber(4),
        new KopiNumber(8),
    ]));
}));
describe('Splitting', () => {
    test('splitEvery', () => __awaiter(void 0, void 0, void 0, function* () {
        var array = yield interpret(`
      [1, 2, 3, 4, 5] | splitEvery 2 | toArray
    `);
        expect(array).toEqual(new KopiArray([
            new KopiArray([new KopiNumber(1), new KopiNumber(2)]),
            new KopiArray([new KopiNumber(3), new KopiNumber(4)]),
            new KopiArray([new KopiNumber(5)]),
        ]));
        var array = yield interpret(`
      1..5 | splitEvery 2 | toArray
    `);
        expect(array).toEqual(new KopiArray([
            new KopiArray([new KopiNumber(1), new KopiNumber(2)]),
            new KopiArray([new KopiNumber(3), new KopiNumber(4)]),
            new KopiArray([new KopiNumber(5)]),
        ]));
        var array = yield interpret(`
      "abcabca" | splitEvery 3 | toArray
    `);
        expect(array).toEqual(new KopiArray([
            new KopiString('abc'),
            new KopiString('abc'),
            new KopiString('a'),
        ]));
        var array = yield interpret(`
      "abcabca" | map 'succ | splitEvery 3 | toArray
    `);
        expect(array).toEqual(new KopiArray([
            new KopiString('bcd'),
            new KopiString('bcd'),
            new KopiString('b'),
        ]));
    }));
    test('splitOn', () => __awaiter(void 0, void 0, void 0, function* () {
        var array = yield interpret(`
      ["a", ",", "b", ",", "c"] | splitOn "," | toArray
    `);
        expect(array).toEqual(new KopiArray([
            new KopiArray([new KopiString('a')]),
            new KopiArray([new KopiString('b')]),
            new KopiArray([new KopiString('c')]),
        ]));
        var array = yield interpret(`
      "a,b,c" | splitOn "," | toArray
    `);
        expect(array).toEqual(new KopiArray([
            new KopiString('a'),
            new KopiString('b'),
            new KopiString('c'),
        ]));
        var array = yield interpret(`
      ",a,b,c," | splitOn "," | toArray
    `);
        expect(array).toEqual(new KopiArray([
            new KopiString(''),
            new KopiString('a'),
            new KopiString('b'),
            new KopiString('c'),
            new KopiString(''),
        ]));
        var array = yield interpret(`
      "" | splitOn "," | toArray
    `);
        expect(array).toEqual(new KopiArray([
            new KopiString(''),
        ]));
        var array = yield interpret(`
      "," | splitOn "," | toArray
    `);
        expect(array).toEqual(new KopiArray([
            new KopiString(''),
            new KopiString(''),
        ]));
    }));
});
describe('Other', () => {
    test('sum', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      1..5 | sum
    `);
        expect(number).toEqual(new KopiNumber(15));
    }));
});
