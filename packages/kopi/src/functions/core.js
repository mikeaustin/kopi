const fetch = require('node-fetch');

const { KopiTuple, KopiVector } = require('../classes');

const print = (val) => console.log(val.toString());

const char = (num) => String.fromCodePoint(num);

const string = (num) => String(num);

const number = ({ value }) => Number(value);

const random = () => Math.random();

const time = () => new Date().toLocaleTimeString();

const id = (x) => x;

const even = (num) => num % 2 === 0;

const max = (tuple) => Math.max(tuple.elements[0], tuple.elements[1]);

const _let = (fn, scope, visitors) => {
  return fn.apply(undefined, [KopiTuple.empty, scope, visitors]);
};

const match = (value, scope, visitors) => (funcs) => {
  for (func of funcs.elements) {
    if (func.params.getMatches(value)) {
      return func.apply(undefined, [value, scope, visitors]);
    }
  }
};

const write = (val) => new Promise(resolve => process.stdout.write(val.toString(), () => resolve()));

const sleep = (secs) => new Promise(resolve => setTimeout(() => resolve(secs), secs * 1000));

const _fetch = (url) => fetch(url).then(data => data.headers.get('content-type'));

module.exports = {
  print,
  char,
  string,
  number,
  random,
  time,
  id,
  even,
  max,
  _let,
  match,
  write,
  sleep,
  _fetch,
};
