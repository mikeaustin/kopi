#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
var readline = require('readline');

const parser = require("../lib/parser");
const { IdentifierPattern, Function, Tuple } = require('../src/visitors/classes');
const { default: TypecheckVisitors } = require('../src/visitors/TypecheckVisitors');
const { default: InterpreterVisitors } = require('../src/visitors/InterpreterVisitors');

Number.prototype.inspect = function () {
  return `${this}`;
};

String.prototype.inspect = function () {
  return `"${this}"`;
};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Any { }

let scope = {
  print: new class extends Function {
    apply(arg, scope, visitors) {
      console.log(arg.toString());
    }
  }(new IdentifierPattern('x', Any), new Tuple([])),
  test: new class extends Function {
    apply(arg, scope, visitors) {
      return arg;
    }
  }(new IdentifierPattern('b', Boolean), Boolean),
  even: new class extends Function {
    apply(arg, scope, visitors) {
      return arg % 2 === 0;
    }
  }(new IdentifierPattern('n', Number), Boolean)
};
let context = {
  print: new Function(new IdentifierPattern('b')),
  test: new Function(new IdentifierPattern('b'), Boolean),
  even: new Function(new IdentifierPattern('n', Number), Boolean)
};

const typeCheck = (ast) => {
  const visitors = new TypecheckVisitors();

  visitors.visitNode(ast, context, types => context = { ...context, ...types });
};

const visitors = new InterpreterVisitors();

async function main() {
  rl.prompt();

  for await (const line of rl) {
    try {
      const ast = parser.parse(line);

      typeCheck(ast);

      const result = visitors.visitNode(ast, scope, variables => scope = { ...scope, ...variables });

      if (result !== undefined) {
        console.log(result.inspect());
      }
    } catch (error) {
      console.log(error);
    }

    rl.prompt();
  }
}

main();
