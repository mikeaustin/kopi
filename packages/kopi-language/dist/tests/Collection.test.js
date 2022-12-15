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
import { KopiDict, KopiNumber, KopiString } from '../modules/terminals/classes';
describe('Collection', () => {
    test('get key', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`
      "foo" | get 0
    `);
        expect(string).toEqual(new KopiString('f'));
        var string = yield interpret(`
      ["f", "o", "o"] | get 0
    `);
        expect(string).toEqual(new KopiString('f'));
        var string = yield interpret(`
      { 0: "f", 1: "o", 2: "o" } | get 0
    `);
        expect(string).toEqual(new KopiString('f'));
    }));
    test('set key', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`
      "abc" | set 1 "e"
    `);
        expect(string).toEqual(new KopiString('aec'));
        var array = yield interpret(`
      ["a", "b", "c"] | set 1 "e"
    `);
        expect(yield Promise.all(array.elements)).toEqual([
            new KopiString('a'),
            new KopiString('e'),
            new KopiString('c'),
        ]);
        var dict = yield interpret(`
      { 0: "f", 1: "o", 2: "o" } | set 1 "e"
    `);
        expect(dict).toEqual(new KopiDict([
            [new KopiNumber(0), Promise.resolve(new KopiString("a"))],
            [new KopiNumber(1), Promise.resolve(new KopiString("e"))],
            [new KopiNumber(2), Promise.resolve(new KopiString("c"))],
        ]));
    }));
    test('remove key', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`
      "abc" | remove 1
    `);
        expect(string).toEqual(new KopiString('ac'));
        var array = yield interpret(`
      ["a", "b", "c"] | remove 1
    `);
        expect(yield Promise.all(array.elements)).toEqual([
            new KopiString('a'),
            new KopiString('c'),
        ]);
        var dict = yield interpret(`
      { 0: "a", 1: "b", 2: "c" } | delete 1
    `);
        expect(dict).toEqual(new KopiDict([
            [new KopiNumber(0), Promise.resolve(new KopiString("a"))],
            [new KopiNumber(2), Promise.resolve(new KopiString("c"))],
        ]));
    }));
    test('update key func', () => __awaiter(void 0, void 0, void 0, function* () {
        var string = yield interpret(`
      "abc" | update 1 (c) => 'succ c
    `);
        expect(string).toEqual(new KopiString('acc'));
        var array = yield interpret(`
      ["a", "b", "c"] | update 1 (c) => 'succ c
    `);
        expect(yield Promise.all(array.elements)).toEqual([
            new KopiString("a"),
            new KopiString("c"),
            new KopiString("c"),
        ]);
        var dict = yield interpret(`
      { 0: "a", 1: "b", 2: "c" } | update 1 (c) => 'succ c
    `);
        expect(dict).toEqual(new KopiDict([
            [new KopiNumber(0), Promise.resolve(new KopiString("a"))],
            [new KopiNumber(1), Promise.resolve(new KopiString("c"))],
            [new KopiNumber(2), Promise.resolve(new KopiString("c"))],
        ]));
    }));
});
