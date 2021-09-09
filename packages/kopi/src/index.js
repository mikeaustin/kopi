#!/usr/bin/env node

const util = require('util');
const fs = require('fs');
const readline = require('readline');

const parser = require('../lib/parser');

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
  const parserLog = fs.createWriteStream('log/parser');

  if (process.argv.length > 2) {
    const input = await util.promisify(fs.readFile)(process.argv[2], 'utf8');

    try {
      const ast = parser.parse(input);

      const formattedAst = util.inspect(ast, {
        compact: false,
        depth: Infinity
      });

      parserLog.write(`${formattedAst}\n\n`);

      const value = await interpreter.visitNode(ast, scope, bind);
    } catch (error) {
      console.error(error.name === 'SyntaxError' ? error.message : error);
    }

    return;
  }

  input.prompt();

  for await (const line of input) {
    try {
      const ast = parser.parse(line);

      for (const astNode of ast.statements) {
        const formattedAst = util.inspect(astNode, {
          compact: false,
          depth: Infinity
        });

        parserLog.write(`${formattedAst}\n\n`);

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
