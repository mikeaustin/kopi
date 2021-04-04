#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
var readline = require('readline');

const parser = require("../lib/parser");
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

let scope = { x: 1 };
let context = { x: Number };

const typeCheck = (ast) => {
  const visitors = new TypecheckVisitors();

  visitors.visitNode(ast, context, types => context = { ...context, ...types });
};

const visitors = new InterpreterVisitors();

async function main() {
  rl.prompt();

  for await (const line of rl) {
    const ast = parser.parse(line);

    typeCheck(ast);
    const result = visitors.visitNode(ast, scope, variables => scope = { ...scope, ...variables });

    if (result !== undefined) {
      console.log('=', result.inspect());
    }

    rl.prompt();
  }
}

main();
