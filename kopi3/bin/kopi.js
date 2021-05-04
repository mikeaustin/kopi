var readline = require('readline');

const parser = require("../lib/parser");
const InterpreterVisitors = require('../src/visitors/InterpreterVisitors');
const initialEnv = require('../lib/env');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let env = initialEnv;

async function main() {
  rl.prompt();

  for await (const line of rl) {
    try {
      const ast = parser.parse(line);

      const result = InterpreterVisitors.visitNode(ast, env);

      if (result !== undefined) {
        console.log(result.inspect());
      }
    } catch (error) {
      console.error(error);
    }

    rl.prompt();
  }
}

main();
