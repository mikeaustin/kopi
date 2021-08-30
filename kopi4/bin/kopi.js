#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
const readline = require('readline');

const parser = require("../lib/parser");

const { default: InterpreterVisitors } = require('../src/InterpreterVisitors');

Function.prototype[util.inspect.custom] = function () {
  return `<function>`;
};

let scope = {
  print: (args) => console.log(args),
  even: (args) => args % 2 === 0,
  z: 5,
};

async function main() {
  let input = null;

  if (process.argv.length > 2) {
    input = await util.promisify(fs.readFile)(process.argv[2], 'utf8');
  } else {
    input = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  process.argv.length === 2 && input.prompt();

  for await (const line of input) {
    try {
      const ast = parser.parse(line);

      for (const astNode of ast.statements) {
        const value = InterpreterVisitors.visit(astNode, scope);

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

    process.argv.length === 2 && input.prompt();
  }
}

main();
