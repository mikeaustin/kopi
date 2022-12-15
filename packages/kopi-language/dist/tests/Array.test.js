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
import { KopiNumber, KopiBoolean, KopiArray, KopiTuple, KopiString } from '../modules/terminals/classes';
describe('Array', () => {
    test('Basics', () => __awaiter(void 0, void 0, void 0, function* () {
        var array = yield interpret(`
      [1, 2, 3]
    `);
        expect(array).toEqual(new KopiArray([
            new KopiNumber(1),
            new KopiNumber(2),
            new KopiNumber(3),
        ]));
        var array = yield interpret(`
      [
        1
        2
        3
      ]
    `);
        expect(array).toEqual(new KopiArray([
            new KopiNumber(1),
            new KopiNumber(2),
            new KopiNumber(3),
        ]));
        var number = yield interpret(`
      'size [1, 2, 3]
    `);
        expect(number.value).toEqual(3);
        var boolean = yield interpret(`
      [1, 2, 3] | has 1
    `);
        expect(boolean).toEqual(new KopiBoolean(true));
        var boolean = yield interpret(`
      [1, 2, 3] | has 3
    `);
        expect(boolean).toEqual(new KopiBoolean(false));
        var boolean = yield interpret(`
      [1, 2, 3] | includes 2
    `);
        expect(boolean).toEqual(new KopiBoolean(true));
    }));
    test('Get', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      [1, 2, 3] 1
    `);
        expect(number).toEqual(new KopiNumber(2));
        var array = yield interpret(`
      [1, 2, 3] [1, 2]
    `);
        expect(array).toEqual(new KopiArray([
            new KopiNumber(2),
            new KopiNumber(3),
        ]));
        var array = yield interpret(`
      [1, 2, 3] 1..3
    `);
        expect(array).toEqual(new KopiArray([
            new KopiNumber(2),
            new KopiNumber(3),
        ]));
        var number = yield interpret(`
      [1, 2, 3] | get 1
    `);
        expect(number).toEqual(new KopiNumber(2));
        var number = yield interpret(`
      [1, 2, 3] | get 3
    `);
        expect(number).toEqual(KopiTuple.empty);
    }));
    test('Set', () => __awaiter(void 0, void 0, void 0, function* () {
        var array = yield interpret(`
      [1, 2, 3] | set 1 5
    `);
        expect(array).toEqual(new KopiArray([
            new KopiNumber(1),
            new KopiNumber(5),
            new KopiNumber(3),
        ]));
        var array = yield interpret(`
      [1, 2, 3] | set 4 5
    `);
        expect(array).toEqual(new KopiArray([
            new KopiNumber(1),
            new KopiNumber(2),
            new KopiNumber(3),
            undefined,
            new KopiNumber(5),
        ]));
        var array = yield interpret(`
      [1, 2, 3] | set 0..1 5
    `);
        expect(array).toEqual(new KopiArray([
            new KopiNumber(5),
            new KopiNumber(3),
        ]));
    }));
    test('Update', () => __awaiter(void 0, void 0, void 0, function* () {
        var array = yield interpret(`
      [1, 2, 3] | update 1 (n) => n + 3
    `);
        expect(array).toEqual(new KopiArray([
            new KopiNumber(1),
            Promise.resolve(new KopiNumber(5)),
            new KopiNumber(3),
        ]));
    }));
    test('Join', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`
      ["a", "b", "c"] | joinWith ", "
    `);
        expect(string).toEqual(new KopiString('a, b, c'));
    }));
    test('Async resolve', () => __awaiter(void 0, void 0, void 0, function* () {
        var array = yield interpret(`
      [1, sleep 2, 3]
    `);
        expect(array).toEqual(new KopiArray([
            Promise.resolve(new KopiNumber(1)),
            Promise.resolve(new KopiNumber(2)),
            Promise.resolve(new KopiNumber(3)),
        ]));
    }));
});
