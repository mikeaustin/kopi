
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
    setIndex = index => () => index

    evaluate (statement, indexes) = match statement (
      (lineNo, "PRINT", value) => {
        print value
        incrementIndex
      }
      (lineNo, "GOTO", value) => {
        setIndex (indexes | get value)
      }
    )

    interpret (source) = {
      program = source | trim | split (String._constructor.newlineRegExp) | map (line) => {
        # [lineNo, command, value] = line | trim | splitOnLimit " " 2
        array = line | trim | splitOnLimit " " 2 | toArray
        (array.(0), array.(1), array.(2))
      } | toArray

      indexes = (0..99, program) | reduce (dict = {:}, index, statement) => {
        dict | set (statement.0) index
      }

      let (index = 0) => {
        match (index == 'size program) (
          true => "Done"
          _    => loop (evaluate (program.(index), indexes) index)
        )
      }
    }

    source = "
      10 PRINT 'Hello, world.'
      20 GOTO 40
      30 PRINT 'How are you?'
      40 PRINT 'Goodbye.'
    "

    interpret source
  `) as KopiString;

  console.log(string);
});
