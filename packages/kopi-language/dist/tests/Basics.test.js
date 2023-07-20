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
import { KopiNumber, KopiString, KopiRange, KopiArray, KopiBoolean } from '../modules/terminals/classes';
describe('Basic syntax', () => {
    test('Types', () => __awaiter(void 0, void 0, void 0, function* () {
        var tuple = yield interpret(`
      (-123, "abc", true, 1..5, [1, 2])
    `);
        expect(yield Promise.all(tuple.fields)).toEqual([
            new KopiNumber(-123),
            new KopiString('abc'),
            new KopiBoolean(true),
            new KopiRange(new KopiNumber(1), new KopiNumber(5)),
            new KopiArray([
                new KopiNumber(1), new KopiNumber(2)
            ])
        ]);
        var array = yield interpret(`
      [123, "abc", true, "a".."c"] | toArray
    `);
        expect(array).toEqual(new KopiArray([
            new KopiNumber(123),
            new KopiString('abc'),
            new KopiBoolean(true),
            new KopiRange(new KopiString('a'), new KopiString('c')),
        ]));
    }));
    test('Async operations', () => __awaiter(void 0, void 0, void 0, function* () {
        var tuple = yield interpret(`
      (sleep (sleep 1) + sleep 1, sleep 1 + sleep 1)
    `);
        expect(yield Promise.all(tuple.fields)).toEqual([
            new KopiNumber(2),
            new KopiNumber(2),
        ]);
    }));
    test('Math', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      5 * 'sin 1 + 5 * 'cos 1
    `);
        expect(number.value).toBeCloseTo(6.908866453380181);
    }));
    test('Function application', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      (x => x + 1) 3 + 'round 2.7
    `);
        expect(number.value).toBeCloseTo(7);
        number = (yield interpret(`
      ((a, b) => a + b) (1, 2)
    `));
        expect(number.value).toBeCloseTo(3);
        number = (yield interpret(`
      ((a, (b, c)) => (a + b) * c) (1, (2, 3))
    `));
        expect(number.value).toBeCloseTo(9);
        number = (yield interpret(`
      ((a, b) => c => (a + b) * c) (1, 2) 3
    `));
        expect(number.value).toEqual(9);
    }));
    test('Default arguments', () => __awaiter(void 0, void 0, void 0, function* () {
        var tuple = yield interpret(`
      ((a, b = 2, c = 3) => (a, b, c)) (1)
    `);
        expect(yield Promise.all(tuple.fields)).toEqual([
            new KopiNumber(1),
            new KopiNumber(2),
            new KopiNumber(3),
        ]);
    }));
    test('Extension Methods', () => __awaiter(void 0, void 0, void 0, function* () {
        // var string = await interpret(`
        //   String ()
        // `) as KopiString;
        // expect(string.value).toEqual("Hello, world");
        var string = yield interpret(`
      'capitalize "foo"
    `);
        expect(string.value).toEqual("FOO");
    }));
    test('Block Expressions', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`{

      (1, 2, 3)

      "abc"

    }`);
        expect(string.value).toEqual('abc');
        var number = yield interpret(`
      ((a, b) => {

        a + b

      }) (1, 2)
    `);
        expect(number.value).toEqual(3);
    }));
    test('Tuple Element Newlines', () => __awaiter(void 0, void 0, void 0, function* () {
        var tuple = yield interpret(`
      (

        ((a, b) => a + b) (0, 1)

        0 + 1 + 1,

        3

      )
    `);
        expect(yield Promise.all(tuple.fields)).toEqual([
            new KopiNumber(1),
            new KopiNumber(2),
            new KopiNumber(3),
        ]);
    }));
    test('match', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`
      match 0 (
        0 => "Zero"
        1 => "One"
      )
    `);
        expect(string.value).toEqual('Zero');
    }));
    test('Pipe', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`
      "foo" | capitalize
    `);
        expect(string.value).toEqual('FOO');
        string = (yield interpret(`
      3.14149 | toFixed 2
    `));
        expect(string.value).toEqual('3.14');
        var number = yield interpret(`
      1 | test 2 3
    `);
        expect(number.value).toEqual(9);
    }));
    test('Fetch', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      fetch "https://mike-austin.com" | size
    `);
        expect(number.value).toEqual(2138);
    }));
    test('Assignment', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      a = 1
      b = 2

      a + b
    `);
        expect(number.value).toEqual(3);
        number = (yield interpret(`
      z = 1
      f = x => x + z
      x = 2

      f 2
    `));
        expect(number.value).toEqual(3);
    }));
    test('Loop', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      let (n = 1) => {
        sleep 0.5
        # print n

        match (n) (
          3 => 3
          n => loop (n + 1)
        )
      }
    `);
        expect(number.value).toEqual(3);
    }));
    test('Member', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      (1..5).to
    `);
        expect(number.value).toEqual(5);
    }));
    test('FunctionPattern', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      add (a, b) = a + b

      add (1, 2)
    `);
        expect(number.value).toEqual(3);
    }));
    test('Named tuple fields', () => __awaiter(void 0, void 0, void 0, function* () {
        var tuple = yield interpret(`
      tuple = (1, b: 2, c: 3)
      (tuple.0, tuple.1, tuple.2)
    `);
        expect(yield Promise.all(tuple.fields)).toEqual([
            new KopiNumber(1),
            new KopiNumber(2),
            new KopiNumber(3),
        ]);
        tuple = (yield interpret(`
      tuple = (1, b: 2, c: 3)
      (tuple.b, tuple.c)
    `));
        expect(yield Promise.all(tuple.fields)).toEqual([
            new KopiNumber(2),
            new KopiNumber(3),
        ]);
    }));
    test('Context', () => __awaiter(void 0, void 0, void 0, function* () {
        var tuple = yield interpret(`
      columnWidth = context 80

      (
        columnWidth | get,
        {
          columnWidth | set 120
          columnWidth | get
        },
        columnWidth | get
      )
    `);
        expect(yield Promise.all(tuple.fields)).toEqual([
            new KopiNumber(80),
            new KopiNumber(120),
            new KopiNumber(80),
        ]);
    }));
});
