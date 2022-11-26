import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiBoolean, KopiNumber } from '../modules/terminals/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('User Type', async () => {
  var number = await interpret(`
    Person = type (name: String, age: String)

    extend Person (
      toString: () => this.name
    )

    person = Person (name: "Joe", age: 30)

    person | toString
  `) as KopiNumber;

  console.log(number);
});
