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
import { KopiString } from '../modules/terminals/classes';
test('Interpret', () => __awaiter(void 0, void 0, void 0, function* () {
    var string = yield interpret(`
    # extend String (
    #   print: () => ()
    # )

    incrementIndex = index => index + 1
    setIndex = index => () => index

    get (value) = match (value 0) (
      "'" => value 1..('size value - 1)
      _   => value
    )

    evaluateAst (statement, indexes) = match statement (
      (lineNo, "PRINT", value) => {
        print (get value)
        incrementIndex
      }
      (lineNo, "GOTO", value) => {
        setIndex (indexes | get value)
      }
    )

    interpret (source) = {
      program = source | trim | split (String.newlineRegExp) | map (line) => {
        let ([lineNo, command, value] = line | trim | splitOnLimit " " 2 | toArray) =>
          (lineNo: lineNo, command, value)
      } | toArray

      indexes = (0..99, program) | reduce (dict = {:}, index, statement) => {
        dict | set (statement.lineNo) index
      }

      let (index = 0) => {
        match (index == 'size program) (
          true => "Done"
          _    => loop (evaluateAst (program index, indexes) index)
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
  `);
    expect(string).toEqual(new KopiString('Done'));
}));
