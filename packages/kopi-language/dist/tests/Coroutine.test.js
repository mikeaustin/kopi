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
test('Coroutine', () => __awaiter(void 0, void 0, void 0, function* () {
    let string = yield interpret(`
    coro = spawn (yield) => {
      let () => {
        yield x => x * x
        sleep 0.1

        loop ()
      }
    }

    let (n = 1) => {
      (coro | send n)

      match (n) (
        3 => "Done"
        n => loop (n + 1)
      )
    }
  `);
    expect(string.value).toEqual('Done');
}));
