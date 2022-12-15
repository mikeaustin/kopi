import { interpret } from '../compiler';

import { KopiBoolean, KopiEnum, KopiNumber } from '../modules/terminals/classes';

test('Enum', async () => {
  var value = await interpret(`
    Days = enum (Mon: 1, Tue: 2, Wed: 3)

    Days.Mon == Days.0
  `);

  expect(value).toEqual(new KopiBoolean(true));

  var value = await interpret(`
    Days = enum (Mon: 1, Tue: 2, Wed: 3)

    Days.Mon.name == "Mon"
  `);

  expect(value).toEqual(new KopiBoolean(true));

  var value = await interpret(`
    Days = enum (Mon: 1, Tue: 2, Wed: 3)

    Days.Mon.value == 1
  `);

  expect(value).toEqual(new KopiBoolean(true));

  var value = await interpret(`
    Days = enum (Mon: 1, Tue: 2, Wed: 3)

    'succ Days.Mon == Days.Tue
  `);

  expect(value).toEqual(new KopiBoolean(true));
});
