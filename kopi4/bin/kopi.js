#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
const readline = require('readline');

const parser = require("../lib/parser");

const { default: InterpreterVisitors } = require('../src/InterpreterVisitors');

Function.prototype[util.inspect.custom] = function () {
  return `<function>`;
};

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  ['+'](that) {
    return new Vector(this.x + that.x, this.y + that.y);
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}

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
  Vector: (args) => new Vector(args.elements[0], args.elements[1]),
  even: (args) => args % 2 === 0,
  max: (args) => Math.max(args.elements[0], args.elements[1]),
  let: (args, _, visitors) => args.apply(undefined, [{ elements: [] }, scope, visitors]),
  do: (args, scope) => InterpreterVisitors.visitNode(args, scope),
  match: (value, _, visitors) => (funcs) => {
    for (func of funcs.elements) {
      if (func.params.getMatches(value)) {
        return func.apply(undefined, [value, scope, visitors]);
      }
    }
  },
};

const bind = updates => scope = ({ ...scope, ...updates });

async function main() {
  if (process.argv.length > 2) {
    const input = await util.promisify(fs.readFile)(process.argv[2], 'utf8');

    try {
      console.log('Parsing...');
      const ast = parser.parse(input);

      console.log('Evaluating...');
      const value = InterpreterVisitors.visitNode(ast, scope, bind);

      if (value !== undefined) {
        const formattedValue = util.inspect(value, {
          compact: false,
          depth: Infinity,
        });

        console.log(formattedValue);
      }
    } catch (error) {
      console.error(error.message);
    }

    return;
  }

  input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  input.prompt();

  for await (const line of input) {
    let ast;

    try {
      ast = parser.parse(line);
    } catch (error) {
      console.error('SyntaxError:', error.message);

      input.prompt();

      continue;
    }

    try {
      for (const astNode of ast.statements) {
        const value = InterpreterVisitors.visitNode(astNode, scope, bind);

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
