var readline = require('readline');

const parser = require("../lib/parser");
const initialEnv = require('../lib/env');
const InterpreterVisitors = require('../src/visitors/InterpreterVisitors');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let env = initialEnv;

const bind = bindings => env = { ...env, ...bindings };

async function main() {
  rl.prompt();

  for await (const line of rl) {
    try {
      const ast = parser.parse(line);

      const result = InterpreterVisitors.visitNode(ast, env, bind);

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
