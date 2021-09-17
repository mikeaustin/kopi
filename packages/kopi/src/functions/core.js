const fetch = require('node-fetch');

const { KopiTuple } = require('../classes');

const coroutines = require('./coroutines');

const kopi_print = (val) => {
  console.log(val.toString());
};

const kopi_char = (num) => {
  String.fromCodePoint(num);
};

const kopi_string = (num) => {
  return String(num);
};

const kopi_number = ({ value }) => {
  return Number(value);
};

const kopi_random = () => {
  return Math.random();
};

const kopi_time = () => {
  return new Date().toLocaleTimeString();
};

const kopi_ident = (x) => {
  return x;
};

const kopi_even = (num) => {
  return num % 2 === 0;
};

const kopi_max = (tuple) => {
  return Math.max(tuple.elements[0], tuple.elements[1]);
};

const kopi_let = (fn, scope, visitors) => {
  return fn.apply(undefined, [KopiTuple.empty, scope, visitors]);
};

const kopi_match = (value, scope, visitors) => (funcs) => {
  for (func of funcs.elements) {
    if (func.params.getMatches(value)) {
      return func.apply(undefined, [value, scope, visitors]);
    }
  }
};

const kopi_write = (val) => {
  return new Promise(resolve => process.stdout.write(val.toString(), () => resolve()));
};

const kopi_sleep = (secs) => {
  return new Promise(resolve => setTimeout(() => resolve(secs), secs * 1000));
};

const kopi_fetch = (url) => {
  return fetch(url).then(data => data.headers.get('content-type'));
};

module.exports = {
  kopi_print,
  kopi_char,
  kopi_string,
  kopi_number,
  kopi_random,
  kopi_time,
  kopi_ident,
  kopi_even,
  kopi_max,
  kopi_let,
  kopi_match,
  kopi_write,
  kopi_sleep,
  kopi_fetch,
  kopi_spawn: coroutines.kopi_spawn,
  kopi_yield: coroutines.kopi_yield,
  kopi_send: coroutines.kopi_send,
};
