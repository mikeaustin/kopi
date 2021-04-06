#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
var readline = require('readline');

const parser = require("../lib/parser");
const { AnyType, BooleanType, NumberType, StringType, FunctionType, UnionType } = require('../src/visitors/types');
const { Function, Tuple, IdentifierPattern } = require('../src/visitors/classes');
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
  true: true,
  false: false,
  print: new class extends Function {
    apply(arg, scope, visitors) {
      console.log(arg.toString());
    }
  }(new IdentifierPattern('x', AnyType), new Tuple([])),

  test: new class extends Function {
    apply(arg, scope, visitors) {
      return arg;
    }
  }(new IdentifierPattern('b', BooleanType), BooleanType),

  even: new class extends Function {
    apply(arg, scope, visitors) {
      return arg % 2 === 0;
    }
  }(new IdentifierPattern('n', NumberType), BooleanType),

  union: new class extends Function {
    apply(arg, scope, visitors) {
      return (typeof arg === 'string' ? Number(arg) : arg) % 2 === 0;
    }
  }(new IdentifierPattern('n', NumberType), BooleanType)
};

let context = {
  true: BooleanType,
  false: BooleanType,
  print: FunctionType(new IdentifierPattern('x', AnyType)),
  test: FunctionType(new IdentifierPattern('b', BooleanType), BooleanType),
  even: FunctionType(new IdentifierPattern('n', NumberType), BooleanType),
  union: FunctionType(new IdentifierPattern('x', UnionType(NumberType, StringType)), BooleanType)
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
