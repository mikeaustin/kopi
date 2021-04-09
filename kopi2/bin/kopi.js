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

Boolean.prototype.type = BooleanType;
Number.prototype.type = NumberType;
String.prototype.type = StringType;

// Object.prototype.escape = function () {
//   return Object.prototype.inspect.apply(this);
// };

Boolean.prototype.escape = function () {
  return `${this}`;
};

Number.prototype.escape = function () {
  return `${this}`;
};

String.prototype.escape = function () {
  return `"${this}"`;
};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const printCodeVisitors = new PrintCodeVisitors();

let context = {
  true: BooleanType,
  false: BooleanType,
  help: FunctionType(new IdentifierPattern('func', AnyType), Void),
  source: FunctionType(new IdentifierPattern('func', AnyType), Void),
  type: FunctionType(new IdentifierPattern('value', AnyType), Void),
  inspect: FunctionType(new IdentifierPattern('value', AnyType), StringType),
  not: FunctionType(new IdentifierPattern('value', BooleanType), BooleanType),
  even: FunctionType(new IdentifierPattern('value', NumberType), BooleanType),
  union: FunctionType(new IdentifierPattern('value', UnionType(NumberType, StringType)), BooleanType),
  print: FunctionType(new IdentifierPattern('value', AnyType), Void),
};

let scope = {
  true: true,
  false: false,
  help: new class extends Function {
    apply(arg, scope, visitors) {
      console.log(arg.help.trim().split('\n').map(line => line.trim()).join('\n'));
    }
  },
  source: new class extends Function {
    apply(arg, scope, visitors) {
      if (arg.body) {
        console.log(printCodeVisitors.visitNode(arg));
      } else {
        console.log('<native function>');
      }
    }
  },
  type: new class extends Function {
    apply(arg, scope, visitors) {
      return arg.type;
    }
  },
  inspect: new class extends Function {
    apply(arg, scope, visitors) {
      console.log(Object.prototype.inspect.apply(arg));
    }
  },
  not: new class extends Function {
    apply(arg, scope, visitors) {
      return !arg;
    }
  },
  even: new class extends Function {
    help = `
      even (value: Number) => Boolean
      Return true if number is even, else return false.
    `;
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
  value.rettype = context[name].rettype;
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
        console.log(result.escape());
      }
    } catch (error) {
      console.log(error);
    }

    rl.prompt();
  }
}

main();
