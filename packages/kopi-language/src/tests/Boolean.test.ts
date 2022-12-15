import { interpret } from '../compiler';

import { KopiBoolean } from '../modules/terminals/classes';

test('Boolean', async () => {
  var boolean = await interpret(`
    'even 2
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));

  var boolean = await interpret(`
    !('even 2)
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(false));

  var boolean = await interpret(`
    !!('even 2)
  `) as KopiBoolean;

  expect(boolean).toEqual(new KopiBoolean(true));
});
