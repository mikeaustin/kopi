#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
const readline = require('readline');

const parser = require("../lib/parser");

const { default: InterpreterVisitors } = require('../src/InterpreterVisitors');

Function.prototype[util.inspect.custom] = function () {
  return `<function>`;
};

let input;

let scope = {
  print: (args) => console.log(args.toString()),
  input: (args) => {
    const rl = input ?? readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`${args} `, data => {
      console.log(data);

      if (rl === input) {
        rl.prompt();
      } else {
        rl.close();
      }
    });
  },
  even: (args) => args % 2 === 0,
  max: (args) => Math.max(args.elements[0], args.elements[1]),
  let: (args) => args.apply(undefined, [{ elements: [] }], InterpreterVisitors),
  match: (value) => (funcs) => {
    for (func of funcs.elements) {
      if (func.params.match(value)) {
        return func.apply(undefined, [value], InterpreterVisitors);
      }
    }
  },
};

const bind = updates => scope = ({ ...scope, ...updates });

async function main() {
  if (process.argv.length > 2) {
    const input = await util.promisify(fs.readFile)(process.argv[2], 'utf8');

    try {
      const ast = parser.parse(input);

      const value = InterpreterVisitors.visit(ast, scope, bind);

      if (value !== undefined) {
        const formattedValue = util.inspect(value, {
          compact: false,
          depth: Infinity
        });

        console.log(formattedValue);
      }
    } catch (error) {
      console.error(error);
    }

    return;
  }

  input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  input.prompt();

  for await (const line of input) {
    try {
      const ast = parser.parse(line);

      for (const astNode of ast.statements) {
        const value = InterpreterVisitors.visit(astNode, scope, bind);

        if (value !== undefined) {
          const formattedValue = util.inspect(value, {
            compact: false,
            depth: Infinity
          });

          console.log(formattedValue);
        }

        const formattedAst = util.inspect(astNode, {
          compact: false,
          depth: Infinity
        });

        console.error();
        console.error(formattedAst);
      }
    } catch (error) {
      console.error(error);
    }

    input.prompt();
  }
}

main();
