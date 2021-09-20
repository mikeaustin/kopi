const util = require('util');
const fs = require('fs');
const http = require('http');
const readline = require('readline');

const { KopiTuple, KopiVector } = require('./classes');

const core = require('./functions/core');

const { compile } = require('./compiler');

let getScope = (input) => ({
  true: true,
  false: false,
  print: core.kopi_print,
  write: core.kopi_write,

  char: core.kopi_char,
  string: core.kopi_string,
  number: core.kopi_number,

  ident: core.kopi_ident,

  random: core.kopi_random,
  date: core.kopi_date,
  time: core.kopi_time,
  read: (filename) => util.promisify(fs.readFile)(filename, 'utf8'),

  even: core.kopi_even,
  max: core.kopi_max,

  import: (filename, scope) => compile(filename, scope),
  export: (values) => values,
  let: core.kopi_let,
  match: core.kopi_match,
  sleep: core.kopi_sleep,
  fetch: core.kopi_fetch,
  exit: (code) => process.exit(code),

  spawn: core.kopi_spawn,
  yield: core.kopi_yield,
  send: core.kopi_send,
  tasks: core.kopi_tasks,

  listen: (coid) => http.createServer(async (request, response) => {
    const value = await core.kopi_send(coid)(request);

    response.writeHead(200);
    response.end(value);
  }).listen({
    port: 8080,
  }),

  at: (index) => async array => await array[index],
  loop: async (fn, scope, visitors) => {
    const exit = (value) => { done = true; return value; };
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
