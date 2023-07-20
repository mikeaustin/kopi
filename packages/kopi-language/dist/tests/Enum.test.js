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
import { KopiBoolean } from '../modules/terminals/classes';
test('Enum', () => __awaiter(void 0, void 0, void 0, function* () {
    var value = yield interpret(`
    Days = enum (Mon: 1, Tue: 2, Wed: 3)

    Days.Mon == Days.0
  `);
    expect(value).toEqual(new KopiBoolean(true));
    var value = yield interpret(`
    Days = enum (Mon: 1, Tue: 2, Wed: 3)

    Days.Mon.name == "Mon"
  `);
    expect(value).toEqual(new KopiBoolean(true));
    var value = yield interpret(`
    Days = enum (Mon: 1, Tue: 2, Wed: 3)

    Days.Mon.value == 1
  `);
    expect(value).toEqual(new KopiBoolean(true));
    var value = yield interpret(`
    Days = enum (Mon: 1, Tue: 2, Wed: 3)

    'succ Days.Mon == Days.Tue
  `);
    expect(value).toEqual(new KopiBoolean(true));
}));
