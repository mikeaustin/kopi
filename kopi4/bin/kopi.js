#!/usr/bin/env node

const util = require("util");
const fs = require("fs");
const readline = require('readline');
const fetch = require('node-fetch');

const parser = require("../lib/parser");

const { default: InterpreterVisitors } = require('../src/InterpreterVisitors');
const { EventEmitter } = require("stream");

Function.prototype[util.inspect.custom] = function () {
  return `<function>`;
};

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  ['+'](that) {
    return new Vector(this.x + that.x, this.y + that.y);
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}

let input;

const target = new EventEmitter();

let scope = {
  print: (args) => console.log(args.toString()),
  sleep: (args) => new Promise(resolve => setTimeout(() => resolve(args * 1000), Number(args * 1000))),
  fetch: (args) => fetch(args).then(data => data.headers.get('content-type')),
  spawn: (args, _, visitors) => {
    args.apply(undefined, [{ elements: [] }, scope, visitors]);
  },
  wait: (args) => new Promise(resolve => target.once('message', (data) => {
    resolve(data);
  })),
  send: (args) => (data) => new Promise(resolve => setImmediate(() => {
    target.once('reply', data => resolve(data));

    target.emit('message', data);
  })),
  input: (args) => {
    const rl = input ?? readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(resolve => {
      rl.question(`${args} `, data => {
        console.log(data);

        if (rl === input) {
          rl.prompt();
        } else {
          rl.close();
        }

        resolve(data);
      });
    });
  },
  Vector: (args) => new Vector(args.elements[0], args.elements[1]),
  even: (args) => args % 2 === 0,
  max: (args) => Math.max(args.elements[0], args.elements[1]),
  let: (args, _, visitors) => args.apply(undefined, [{ elements: [] }, scope, visitors]),
  do: (args, scope) => InterpreterVisitors.visitNode(args, scope),
  match: (value, _, visitors) => (funcs) => {
    for (func of funcs.elements) {
      if (func.params.getMatches(value)) {
        return func.apply(undefined, [value, scope, visitors]);
      }
    }
  },
};

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

      const value = await InterpreterVisitors.visitNode(ast, scope, bind);
    } catch (error) {
      console.error(error.name === 'SyntaxError' ? error.message : error);
    }

    return;
  }

  input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

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

        const value = await InterpreterVisitors.visitNode(astNode, scope, bind);

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
