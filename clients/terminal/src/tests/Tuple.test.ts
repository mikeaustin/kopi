import { interpret } from '../compiler';

import { KopiString } from '../modules/terminals/classes';

test('Basic types', async () => {
  var string = await interpret(`
    (0..5, "a".."e") | reduce (acc = {:}, n, c) => {
      acc | set c n
    }
  `) as KopiString;

  console.log(await string.inspect());
  // expect(string).toEqual(new KopiString('foobar'));
});
