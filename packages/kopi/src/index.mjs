#!/usr/bin/env node

import util from 'util';
import readline from 'readline';

import parser from '../lib/parser.js';
import { compile } from './compiler.js';

import _interpreter from './visitors/Interpreter.js';
import _getScope from './scope.js';

const { default: interpreter } = _interpreter;
const { default: getScope } = _getScope;

Function.prototype.toStringAsync = function () {
  return '<function>';
};

Function.prototype[util.inspect.custom] = function () {
  return '<function>';
};

const input = process.argv.length === 2 ? readline.createInterface({
  input: process.stdin,
  output: process.stdout,
}) : null;

let scope = getScope(input);

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
      console.error(error.name === 'SyntaxError' ? error.message : error);
    }

    input.prompt();
  }
}

main();
