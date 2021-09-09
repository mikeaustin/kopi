const readline = require('readline');
const fetch = require('node-fetch');
const { EventEmitter } = require('stream');

const { Tuple, Vector } = require('./classes');

const target = new EventEmitter();

let getScope = (input) => ({
  import: (args) => 0,
  number: (args) => Number(args),
  print: (args) => console.log(args.toString()),
  sleep: (args) => new Promise(resolve => setTimeout(() => resolve(args * 1000), Number(args * 1000))),
  fetch: (args) => fetch(args).then(data => data.headers.get('content-type')),
  spawn: (args, scope, visitors) => {
    args.apply(undefined, [{ elements: [] }, scope, visitors]);
  },
  yield: (args, scope, visitors) => {
    return new Promise(resolve => {
      target.once('message', (event) => {
        event.value = args.apply(undefined, [event.data, scope, visitors]);

        resolve(event.value);
      });
    });
  },
  send: (args) => (data) => {
    return new Promise(resolve => setImmediate(() => {
      const event = { data };
      target.emit('message', event);

      resolve(event.value);
    }));
  },
  random: (argss) => Math.random(),
  repeat: (args, scope, visitors) => (
    function next(value) {
      if (value?.elements?.length === 0) {
        value = 1;
      }
      const nextValue = args.apply(undefined, [value, scope, visitors]);

      return new Tuple([nextValue, () => next(nextValue)]);
    }
  ),
  input: (args) => {
    const rl = input ?? readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(resolve => {
      rl.question(`${args} `, data => {
        if (rl !== input) {
          rl.close();
        }

        resolve(data);
      });
    });
  },
  Vector: (args) => new Vector(args.elements[0], args.elements[1]),
  even: (args) => args % 2 === 0,
  max: (args) => Math.max(args.elements[0], args.elements[1]),
  let: (args, scope, visitors) => args.apply(undefined, [{ elements: [] }, scope, visitors]),
  do: (args, scope) => interpreter.visitNode(args, scope),
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
