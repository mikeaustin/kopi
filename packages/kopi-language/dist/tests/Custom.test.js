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
describe('Types', () => {
    test('Number', () => __awaiter(void 0, void 0, void 0, function* () {
        var number = yield interpret(`
      Number.from "5" + Number.E
    `);
        expect(number.value).toBeCloseTo(7.718281828459045);
        var value = yield interpret(`
      Number
    `);
        expect(value).toEqual(KopiNumber);
    }));
    test('User type', () => __awaiter(void 0, void 0, void 0, function* () {
        var value = yield interpret(`
      Person = type (name: String, age: String)
  
      Person (name: "Joe", age: 30)
    `);
        expect(yield Promise.all(value.fields)).toEqual([
            new KopiString("Joe"),
            new KopiNumber(30)
        ]);
        expect(value.fieldNames).toEqual([
            "name",
            "age",
        ]);
        var string = yield interpret(`
      Person = type (name: String, age: String)
  
      extend Person (
        toString: () => "Name: " ++ this.name ++ ", age: " ++ this.age
      )
  
      Person (name: "Joe", age: 30) | toString
    `);
        expect(string).toEqual(new KopiString("Name: Joe, age: 30"));
    }));
});
