#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
const readline = require('readline');

const parser = require("../lib/parser");

const InterpreterVisitors = require('../src/InterpreterVisitors');

async function main() {
  if (process.argv.length > 2) {
    const input = await util.promisify(fs.readFile)(process.argv[2], 'utf8');

    const ast = parser.parse(input);

    for (let node of ast.statements) {
      const formattedAst = util.inspect(node, {
        compact: false,
        depth: Infinity
      });

      console.log(formattedAst);
    }

    return;
  }

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.prompt();

  for await (const line of rl) {
    try {
      const ast = parser.parse(line);

      for (let node of ast.statements) {
        const formattedAst = util.inspect(node, {
          compact: false,
          depth: Infinity
        });

        console.log(formattedAst);
      }
    } catch (error) {
      console.error(error);
    }

    rl.prompt();
  }
}

main();
