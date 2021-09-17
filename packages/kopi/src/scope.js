const readline = require('readline');
const fetch = require('node-fetch');

const { KopiTuple, KopiVector } = require('./classes');

const core = require('./functions/core');

const { compile } = require('./compiler');

let getScope = (input) => ({
  print: core.kopi_print,
  write: core.kopi_write,

  char: core.kopi_char,
  string: core.kopi_string,
  number: core.kopi_number,

  random: core.kopi_random,
  time: core.kopi_time,
  ident: core.kopi_ident,
  even: core.kopi_even,
  max: core.kopi_max,

  let: core.kopi_let,
  match: core.kopi_match,
  sleep: core.kopi_sleep,
  fetch: core.kopi_fetch,

  spawn: core.kopi_spawn,
  yield: core.kopi_yield,
  send: core.kopi_send,

  at: (index) => async array => await array[index],
  import: (filename, scope) => compile(filename, scope),
  export: (values) => values,
  exit: (code) => process.exit(code),
  loop: async (fn, scope, visitors) => {
    const exit = () => { done = true; };
    const func = await fn.apply(undefined, [exit, scope, visitors]);

    let done = false;
    let value = KopiTuple.empty;

    while (!done) {
      value = await func.apply(undefined, [value, scope, visitors]);
    }

    return value;

    // function loop(value) {
    //   setImmediate(async () => {
    //     value = await func.apply(undefined, [value, scope, visitors]);

    //     loop(value);
    //   });
    //   loop(value);
    // }
    // loop(value);
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
});

module.exports = {
  default: getScope,
};
