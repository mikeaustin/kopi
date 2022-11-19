import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiNumber } from '../modules/terminals/classes';

async function interpret(source: string) {
  let ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Coroutine', async () => {
  let string = await interpret(`
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
  `) as KopiNumber;

  expect(string.value).toEqual('Done');
});
