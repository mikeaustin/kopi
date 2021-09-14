const readline = require('readline');
const fetch = require('node-fetch');

const { KopiTuple, KopiVector } = require('./classes');

const { print, char, string, number, random, time, id } = require('./functions/core');
const { spawn, yield, send } = require('./functions/coroutines');

let getScope = (input) => ({
  print,
  char,
  string,
  number,
  random,
  time,
  id,
  at: (index) => async array => await array[index],
  import: (args) => 0,
  write: (val) => new Promise(resolve => process.stdout.write(val.toString(), () => resolve())),
  sleep: (secs) => new Promise(resolve => setTimeout(() => resolve(secs), secs * 1000)),
  fetch: (url) => fetch(url).then(data => data.headers.get('content-type')),
  loop: async (fn, scope, visitors) => {
    const exit = () => { throw -1; };
    const func = await fn.apply(undefined, [exit, scope, visitors]);

    let value = KopiTuple.empty;

    function loop(value) {
      setImmediate(async () => {
        value = await func.apply(undefined, [value, scope, visitors]);

        loop(value);
      });
    }
    loop(value);
  },
  spawn,
  yield,
  send,
  repeat: (fn, scope, visitors) => (
    function next(value) {
      if (value?.elements?.length === 0) {
        value = 1;
      }
      const nextValue = fn.apply(undefined, [value, scope, visitors]);

      return new KopiTuple([nextValue, () => next(nextValue)]);
    }
  ),
  input: (str) => {
    const rl = input ?? readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(resolve => {
      rl.question(`${str} `, data => {
        if (rl !== input) {
          rl.close();
        }

        resolve(data);
      });
    });
  },
  Vector: (tuple) => new KopiVector(tuple.elements[0], tuple.elements[1]),
  even: (num) => num % 2 === 0,
  max: (tuple) => Math.max(tuple.elements[0], tuple.elements[1]),
  let: (fn, scope, visitors) => {
    return fn.apply(undefined, [KopiTuple.empty, scope, visitors]);
  },
  // do: (args, scope) => interpreter.visitNode(args, scope),
  match: (value, scope, visitors) => (funcs) => {
    for (func of funcs.elements) {
      if (func.params.getMatches(value)) {
        return func.apply(undefined, [value, scope, visitors]);
      }
    }
  },
});

module.exports = {
  default: getScope,
};
