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
test('Factorial', () => __awaiter(void 0, void 0, void 0, function* () {
    let number = yield interpret(`
    fix = f => (x => f (y => x x y)) x => f (y => x x y)

    factorial = fix factorial => n => match n (
      0 => 1
      n => n * factorial (n - 1)
    )

    factorial 5
  `);
    expect(number.value).toEqual(120);
    number = (yield interpret(`
    factorial (n) = match n (
      0 => 1
      n => n * factorial (n - 1)
    )

    factorial 5
  `));
    expect(number.value).toEqual(120);
    number = (yield interpret(`
    factorial (n) = let (i = 1, accum = 1) => {
      match (i > n) (
        true => accum
        _    => loop (i + 1, accum * i)
      )
    }

    factorial 5
  `));
    expect(number.value).toEqual(120);
}));
