#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
var readline = require('readline');

const parser = require("../lib/parser");
const { AnyType, Void, BooleanType, NumberType, StringType, TupleType, FunctionType, UnionType } = require('../src/visitors/types');
const { Function, Tuple, IdentifierPattern } = require('../src/visitors/classes');
const { default: TypecheckVisitors } = require('../src/visitors/TypecheckVisitors');
const { default: InterpreterVisitors } = require('../src/visitors/InterpreterVisitors');
const { default: PrintCodeVisitors } = require('../src/visitors/PrintCodeVisitors');

const { default: initialContext } = require('./context');
const { default: initialScope } = require('./scope');

Object.prototype.inspect = function () {
  if (this.closure) {
    this.closure[util.inspect.custom] = function (depth, opts) {
      return `{ ... }`;
    };
  }

  return util.inspect(this, {
    compact: false,
    depth: Infinity,
  });
};

// Object.prototype.escape = function () {
//   return Object.prototype.inspect.apply(this);
// };

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const printCodeVisitors = new PrintCodeVisitors();

let context = initialContext;
let scope = initialScope;

Object.entries(scope).forEach(([name, value]) => {
  value.params = context[name].params;
  value.rettype = context[name].rettype;
});

const typeCheck = (ast) => {
  const visitors = new TypecheckVisitors();

  visitors.visitNode(ast, context, types => context = { ...context, ...types });
};

const visitors = new InterpreterVisitors();

async function main() {
  console.log('Kopi 0.0.1 Shell | 2021 Mike Austin');
  console.log('Enter \'env\' to view the top-level environment.');

  rl.prompt();

  for await (const line of rl) {
    try {
      const ast = parser.parse(line);

      typeCheck(ast);

      const result = visitors.visitNode(ast, scope, variables => scope = { ...scope, ...variables });

      if (result !== undefined) {
        console.log(result.escape());
      }
    } catch (error) {
      console.log(error);
    }

    rl.prompt();
  }
}

main();
