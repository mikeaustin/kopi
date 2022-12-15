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
import { KopiString } from '../modules/terminals/classes';
describe('String', () => {
    test('Get', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`
      "foo".(0)
    `);
        expect(string).toEqual(new KopiString('f'));
        var string = yield interpret(`
      "𝒽𝑒𝓁𝓁𝑜".([1, 2, 0])
    `);
        expect(string).toEqual(new KopiString('𝑒𝓁𝒽'));
        var string = yield interpret(`
      "foo".(1..3)
    `);
        expect(string).toEqual(new KopiString('oo'));
    }));
    test('Set', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`
      "foo".(0, "b")
    `);
        expect(string).toEqual(new KopiString('boo'));
        var string = yield interpret(`
      "𝒽𝑒𝓁𝓁𝑜".(2..4, "𝓇")
    `);
        expect(string).toEqual(new KopiString('𝒽𝑒𝓇𝑜'));
        var string = yield interpret(`
      str = "𝒽𝑒𝓁𝓁𝑜"
      str.(3..5, str.([4, 3]))
    `);
        expect(string).toEqual(new KopiString('𝒽𝑒𝓁𝑜𝓁'));
        var string = yield interpret(`
      "foo" | set 0 "b"
    `);
        expect(string).toEqual(new KopiString('boo'));
        var string = yield interpret(`
      "𝒽𝑒𝓁𝓁𝑜" | set 2..4 "𝓇"
    `);
        expect(string).toEqual(new KopiString('𝒽𝑒𝓇𝑜'));
    }));
    test('Apply', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`
      "foo" 0
    `);
        expect(string).toEqual(new KopiString('f'));
        var string = yield interpret(`
      "𝒽𝑒𝓁𝓁𝑜" [1, 2, 0]
    `);
        expect(string).toEqual(new KopiString('𝑒𝓁𝒽'));
        var string = yield interpret(`
      "foo" 1..3
    `);
        expect(string).toEqual(new KopiString('oo'));
        var string = yield interpret(`
      "foo" 3..0
    `);
        expect(string).toEqual(new KopiString('oof'));
    }));
});
