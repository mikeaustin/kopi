#!/usr/bin/env node

const util = require('util');
const readline = require('readline');

const parser = require('../lib/parser');
const { compile } = require('./compiler');

const { default: interpreter } = require('./visitors/Interpreter');
const { default: getScope } = require('./scope');

Function.prototype[util.inspect.custom] = function () {
  return `<function>`;
};

const input = process.argv.length === 2 ? readline.createInterface({
  input: process.stdin,
  output: process.stdout
}) : null;

let scope = getScope(input);

const bind = updates => scope = ({ ...scope, ...updates });

async function main() {
  if (process.argv.length > 2) {
    await compile(process.argv[2], scope);

    return;
  }

  input.prompt();

  for await (const line of input) {
    try {
      const astRootNode = parser.parse(line);

      for (const astNode of astRootNode.statements) {
        const value = await interpreter.visitNode(astNode, scope, bind);

        if (value !== undefined) {
          const formattedValue = util.inspect(value, {
            compact: false,
            depth: Infinity
          });

          console.log(formattedValue);
        }
      }
    } catch (error) {
      console.error(error.name === 'SyntaxError' ? error.message : error);
    }

    input.prompt();
  }
}

main();
