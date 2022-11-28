
import * as parser from '../lib/parser';

import { transform, evaluate, environment } from '../compiler';
import { KopiArray, KopiBoolean, KopiNumber, KopiStream, KopiString } from '../modules/terminals/classes';
import { KopiRange } from '../modules/operators/classes';

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluate(transform(ast), environment, () => { });
}

test('Interpret', async () => {
  var string = await interpret(`
    incrementIndex = index => index + 1

    evaluate (statement) = match statement (
      (lineNo, "PRINT", value) => {
        print value
        incrementIndex
      }
    )

    interpret (source) = {
      program = source | trim | split (String._constructor.newlineRegExp) | map (line) => {
        'trim line
      }
      print (program | inspect)

      program = [
        (10, "PRINT", "Hello, world.")
        (20, "PRINT", "How are you?")
      ]

      let (index = 0) => {
        match (index == 'size program) (
          true => "Done"
          _    => loop (evaluate program.(index) index)
        )
      }
    }

    source = "
      10 PRINT 'Hello, world.'
      20 PRINT 'How are you?'
    "

    interpret source
  `) as KopiString;

  console.log(string);
});
