#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
var readline = require('readline');

const parser = require("../lib/parser");

const { default: TypecheckVisitors } = require('../src/visitors/TypecheckVisitors');
const { default: InterpreterVisitors } = require('../src/visitors/InterpreterVisitors');

const { default: initialContext } = require('./context');
const { default: initialScope } = require('./scope');

Object.prototype.inspect = function () {
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

let context = initialContext;
let scope = initialScope;

Object.entries(scope).forEach(([name, value]) => {
  if (context[name]?.params) {
    value.params = context[name].params;
    value.rettype = context[name].rettype;
    value.type = context[name];
  }
});

const typeCheck = (ast) => {
  const visitors = new TypecheckVisitors();
  const bind = types => context = { ...context, ...types };

  return visitors.visitNode(ast, context, bind);
};

const visitors = new InterpreterVisitors();

const extend = (typesMap, type, funcsObject) => {
  return new Map([
    ...typesMap, [type, {
      ...(typesMap.get(type) || {}),
      ...funcsObject
    }]
  ]);
};

scope._methods = extend(scope._methods, String, {
  toString: new class extends Function {
    apply() { return this.valueOf(); }
  },
  capitalize: new class extends Function {
    apply() { return this.slice(0, 1).toUpperCase() + this.slice(1); }
  },
});

const bind = variables => scope = { ...scope, ...variables };

async function main() {
  console.log('Kopi 0.0.1 Shell | 2021 Mike Austin');
  console.log('Enter \'help\' to view top-level functions.');

  rl.prompt();

  for await (const line of rl) {
    try {
      const ast = parser.parse(line);

      const typeCheckedAst = typeCheck(ast);
      const result = visitors.visitNode(ast, scope, bind);

      if (result !== undefined) {
        console.log(`${result.escape()}\x1B[90m :: ${typeCheckedAst?.escape()}\x1B[0m`);
      }
    } catch (error) {
      console.log(error);
    }

    rl.prompt();
  }
}

main();
