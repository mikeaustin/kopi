var readline = require('readline');

const parser = require("../lib/parser");
const initialEnv = require('../lib/env');
const InterpreterVisitors = require('../src/visitors/InterpreterVisitors');
const TypecheckVisitors = require('../src/visitors/TypecheckVisitors');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let context = {
  version: String
};

let env = initialEnv;

const bindContext = types => context = { ...context, ...types };
const bindEnv = bindings => env = { ...env, ...bindings };

async function main() {
  rl.prompt();

  for await (const line of rl) {
    try {
      const ast = parser.parse(line);

      const typedAst = TypecheckVisitors.visitNode(ast, context, bindContext);

      console.log(typedAst);

      const result = InterpreterVisitors.visitNode(ast, env, bindEnv);

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
