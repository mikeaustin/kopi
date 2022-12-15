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
import { KopiDict, KopiNumber, KopiString, KopiTuple } from '../modules/terminals/classes';
describe('Tuple', () => {
    test('Basics', () => __awaiter(void 0, void 0, void 0, function* () {
        var tuple = yield interpret(`
      (1, 2)
    `);
        expect(tuple).toEqual(new KopiTuple([
            Promise.resolve(new KopiNumber(1)),
            Promise.resolve(new KopiNumber(2)),
        ]));
        var tuple = yield interpret(`
      (a: 1, b: 2)
    `);
        expect(tuple).toEqual(new KopiTuple([
            Promise.resolve(new KopiNumber(1)),
            Promise.resolve(new KopiNumber(2)),
        ], [
            'a',
            'b',
        ]));
        var dict = yield interpret(`
      (1..3, "a".."z") | reduce (acc = {:}, n, c) => {
        acc | set c n
      }
    `);
        expect(dict).toEqual(new KopiDict([
            [new KopiString('a'), Promise.resolve(new KopiNumber(1))],
            [new KopiString('b'), Promise.resolve(new KopiNumber(2))],
            [new KopiString('c'), Promise.resolve(new KopiNumber(3))],
        ]));
    }));
});
