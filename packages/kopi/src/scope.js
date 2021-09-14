const readline = require('readline');
const fetch = require('node-fetch');
const { EventEmitter } = require('stream');

const { KopiTuple, KopiVector } = require('./classes');

const target = new EventEmitter();

let getScope = (input) => ({
  id: (x) => x,
  at: (index) => async array => await array[index],
  import: (args) => 0,
  number: ({ value }) => Number(value),
  char: (num) => String.fromCodePoint(num),
  string: (num) => String(num),
  print: (val) => console.log(val.toString()),
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
  spawn: (fn, scope, visitors) => {
    fn.apply(undefined, [KopiTuple.empty, scope, visitors]);
  },
  yield: (fn, scope, visitors) => {
    return new Promise(resolve => {
      target.once('message', (event) => {
        event.value = fn.apply(undefined, [event.data, scope, visitors]);

        resolve(event.value);
      });
    });
  },
  send: (cid) => (data) => {
    return new Promise(resolve => setImmediate(() => {
      const event = { data };
      target.emit('message', event);

      resolve(event.value);
    }));
  },
  random: () => Math.random(),
  time: () => new Date().toLocaleTimeString(),
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
