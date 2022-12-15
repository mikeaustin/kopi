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
import { KopiNumber, KopiString } from '../modules/terminals/classes';
test('Array', () => __awaiter(void 0, void 0, void 0, function* () {
    var array = yield interpret(`
  (1..5 2) | toArray
`);
    expect(yield Promise.all(array.elements)).toEqual([
        new KopiNumber(1),
        new KopiNumber(3),
        new KopiNumber(5),
    ]);
    array = (yield interpret(`
  ("a".."z" 2) | take 3 | toArray
`));
    expect(yield Promise.all(array.elements)).toEqual([
        new KopiString('a'),
        new KopiString('c'),
        new KopiString('e'),
    ]);
    var array = yield interpret(`
    -1..1 | map (n) => n + 2 | toArray
  `);
    expect(yield Promise.all(array.elements)).toEqual([
        new KopiNumber(1),
        new KopiNumber(2),
        new KopiNumber(3),
    ]);
}));
