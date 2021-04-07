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
  not: FunctionType(new IdentifierPattern('value', BooleanType), BooleanType),
  even: FunctionType(new IdentifierPattern('value', NumberType), BooleanType),
  union: FunctionType(new IdentifierPattern('value', UnionType(NumberType, StringType)), BooleanType),
  print: FunctionType(new IdentifierPattern('value', AnyType), Void),
};

let scope = {
  true: true,
  false: false,
  not: new class extends Function {
    apply(arg, scope, visitors) {
      return !arg;
    }
  },
  even: new class extends Function {
    apply(arg, scope, visitors) {
      return arg % 2 === 0;
    }
  },
  union: new class extends Function {
    apply(arg, scope, visitors) {
      return (typeof arg === 'string' ? Number(arg) : arg) % 2 === 0;
    }
  },
  print: new class extends Function {
    apply(arg, scope, visitors) {
      console.log(arg.toString());
    }
  },
};

Object.entries(scope).forEach(([name, value]) => {
  value.params = context[name].params;
  value.type = context[name].type;
});

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
