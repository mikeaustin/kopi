#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
var readline = require('readline');

const parser = require("../lib/parser");
const { IdentifierPattern } = require('../src/visitors/classes');
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

let scope = {
  z: 1,
  test: {
    apply(arg, scope, visitors) {
      return arg;
    }
  },
  even: {
    apply(arg, scope, visitors) {
      return arg % 2 === 0;
    }
  }
};
let context = {
  z: Number,
  test: {
    params: new IdentifierPattern('b', Boolean),
    type: Boolean,
    get name() {
      return `Boolean => Boolean`;
    }
  },
  even: {
    params: new IdentifierPattern('n', Number),
    type: Boolean,
    get name() {
      return `Number => Boolean`;
    }
  }
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
