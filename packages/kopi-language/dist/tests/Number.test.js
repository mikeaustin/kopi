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
import { KopiBoolean, KopiNumber, KopiString } from '../modules/terminals/classes';
describe('Number', () => {
    test('Math', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      2 + 3
    `);
        expect(number).toEqual(new KopiNumber(5));
        var number = yield interpret(`
      2 + 3 * 5 / 2
    `);
        expect(number).toEqual(new KopiNumber(9.5));
        var number = yield interpret(`
      (2 + 3) * 5 / 2
    `);
        expect(number).toEqual(new KopiNumber(12.5));
        var number = yield interpret(`
      4 % 2
    `);
        expect(number).toEqual(new KopiNumber(0));
        var number = yield interpret(`
      5 % 2
    `);
        expect(number).toEqual(new KopiNumber(1));
        var number = yield interpret(`
      'round 2.5
    `);
        expect(number).toEqual(new KopiNumber(3));
    }));
    test('Relational', () => __awaiter(void 0, void 0, void 0, function* () {
        var boolean = yield interpret(`
      3 == 3
    `);
        expect(boolean).toEqual(new KopiBoolean(true));
        var boolean = yield interpret(`
      3 != 3
    `);
        expect(boolean).toEqual(new KopiBoolean(false));
        var boolean = yield interpret(`
      2 < 3
    `);
        expect(boolean).toEqual(new KopiBoolean(true));
        var boolean = yield interpret(`
      2 > 3
    `);
        expect(boolean).toEqual(new KopiBoolean(false));
        var boolean = yield interpret(`
      3 <= 3
    `);
        expect(boolean).toEqual(new KopiBoolean(true));
        var boolean = yield interpret(`
      3 >= 3
    `);
        expect(boolean).toEqual(new KopiBoolean(true));
    }));
    test('Trig', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      'sin 0
    `);
        expect(number.value).toBeCloseTo(0);
        var number = yield interpret(`
      'cos 0
    `);
        expect(number.value).toBeCloseTo(1);
    }));
    test('Misc', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      3.14159 | toFixed 2
    `);
        expect(number).toEqual(new KopiString('3.14'));
    }));
});
