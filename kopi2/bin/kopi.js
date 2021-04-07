#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
var readline = require('readline');

const parser = require("../lib/parser");
const { AnyType, Void, BooleanType, NumberType, StringType, TupleType, FunctionType, UnionType } = require('../src/visitors/types');
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

let context = {
  true: BooleanType,
  false: BooleanType,
  print: FunctionType(new IdentifierPattern('x', AnyType), Void),
  not: FunctionType(new IdentifierPattern('value', BooleanType), BooleanType),
  even: FunctionType(new IdentifierPattern('n', NumberType), BooleanType),
  union: FunctionType(new IdentifierPattern('x', UnionType(NumberType, StringType)), BooleanType)
};

let scope = {
  true: true,
  false: false,
  print: new class extends Function {
    params = context.print.params;
    rettype = context.print.rettype;

    apply(arg, scope, visitors) {
      console.log(arg.toString());
    }
  },
  not: new class extends Function {
    params = context.not.params;
    rettype = context.not.params;

    apply(arg, scope, visitors) {
      return !arg;
    }
  },
  even: new class extends Function {
    params = context.even.params;
    rettype = context.even.params;

    apply(arg, scope, visitors) {
      return arg % 2 === 0;
    }
  },
  union: new class extends Function {
    params = context.union.params;
    rettype = context.union.params;

    apply(arg, scope, visitors) {
      return (typeof arg === 'string' ? Number(arg) : arg) % 2 === 0;
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
