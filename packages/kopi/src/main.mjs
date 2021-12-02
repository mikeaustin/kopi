#!/usr/bin/env node

import readline from 'readline';

import parser from '../lib/parser.js';
import { compile } from './compiler.mjs';

import interpreter from './visitors/Interpreter.mjs';
import getScope from './scope.mjs';
import nodeScope from './node.mjs';

Function.prototype.inspectAsync = function () {
  return '<function>';
};

Function.prototype.toStringAsync = function () {
  return '<function>';
};

const input = process.argv.length === 2 ? readline.createInterface({
  input: process.stdin,
  output: process.stdout,
}) : null;

let scope = { ...getScope(input), ...nodeScope(input) };

const bind = (updates) => scope = ({ ...scope, ...updates });

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
          console.log(await value.inspectAsync());
        }
      }
    } catch (error) {
      if (error.name === 'SyntaxError') {
        console.error(`*** ${error.name}: ${error.message}\n  [Line ${error.location.start.line}]`);
      } else if (error.name === 'RuntimeError') {
        console.error('***', error.stack);
      } else {
        console.error(`*** JavaScript ${error.stack}`);
      }
    }

    input.prompt();
  }
}

main();
