import { interpret } from '../compiler';

import { KopiNumber, KopiString, KopiTuple } from '../modules/terminals/classes';

test('User Type', async () => {
  var value = await interpret(`
    Person = type (name: String, age: String)

    Person (name: "Joe", age: 30)
  `) as KopiTuple;

  expect(await Promise.all(value.fields)).toEqual([
    new KopiString("Joe"),
    new KopiNumber(30)
  ]);

  expect(value.fieldNames).toEqual([
    "name",
    "age",
  ]);

  var string = await interpret(`
    Person = type (name: String, age: String)

    extend Person (
      toString: () => "Name: " ++ this.name ++ ", age: " ++ this.age
    )

    Person (name: "Joe", age: 30) | toString
  `) as KopiString;

  expect(string).toEqual(new KopiString("Name: Joe, age: 30"));
});
