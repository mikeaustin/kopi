import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiArray, KopiBoolean, KopiNumber, KopiStream, KopiTuple } from '../modules/terminals/classes';
import { KopiRange } from '../modules/operators/classes';
import { KopiStringWithoutIterator as KopiString } from '../modules/terminals/classes/KopiString';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

expect.extend({
  toBeEquivalent(received, expected) {
    return this.equals(JSON.stringify(received), JSON.stringify(expected))
      ? { pass: true, message: () => '' }
      : { pass: false, message: () => '' };
  }
});

test('Basic types', async () => {
});
