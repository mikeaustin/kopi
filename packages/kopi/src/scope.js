const readline = require('readline');
const fetch = require('node-fetch');

const { KopiTuple, KopiVector } = require('./classes');

const { print, char, string, number, random, time, id, even, max, _let, match, write, sleep, _fetch } = require('./functions/core');
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
  write,
  sleep,
  fetch: _fetch,
  spawn,
  yield,
  send,
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
  even,
  max,
  let: _let,
  match,
});

module.exports = {
  default: getScope,
};
