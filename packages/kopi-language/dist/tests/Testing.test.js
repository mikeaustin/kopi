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
import { KopiArray, KopiBoolean, KopiString } from '../modules/terminals/classes';
test('Testing', () => __awaiter(void 0, void 0, void 0, function* () {
    var string = yield interpret(`
    "foo" ++ "bar"
  `);
    expect(string).toEqual(new KopiString('foobar'));
    var string = yield interpret(`
    1..3 | map '(toFixed 2) | toArray
  `);
    expect(string).toEqual(new KopiArray([
        new KopiString('1.00'),
        new KopiString('2.00'),
        new KopiString('3.00'),
    ]));
    var boolean = yield interpret(`
    (1, "2", [true, 'bar, 1..5]) == (1, "2", [true, 'bar, 1..5])
  `);
    expect(boolean).toEqual(new KopiBoolean(true));
    var boolean = yield interpret(`
    (1, 2) == (1, 3)
  `);
    expect(boolean).toEqual(new KopiBoolean(false));
    var string = yield interpret(`
    extend String (
      capitalize2: (n) => 'toUpperCase this.(0..1) ++ this.(1..3)
      capitalize3: (n) => 'toUpperCase (this 0..1) ++ (this 1..3)
    )

    "foo" | capitalize3
  `);
    expect(string).toEqual(new KopiString('Foo'));
    var array = yield interpret(`
    [1, 2, 3] | get 1..3
  `);
    // var object = await interpret(`
    //   timer () | map (n) => n / 1000 | take 3 | each (n) => {
    //     print n
    //   }
    // `) as KopiStream;
    // var string = await interpret(`
    //   o = Observer 5
    //   oo = o | map (n) => {
    //     print "here"
    //     sleep 0.1
    //   }
    //   print "zzz 1"
    //   oo | take 2 | each (n) => print n
    //   print "zzz 2"
    //   o | set 10
    //   o | set 10
    // `) as KopiString;
}));
