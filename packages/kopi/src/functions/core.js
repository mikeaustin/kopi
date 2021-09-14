const print = (val) => console.log(val.toString());

const char = (num) => String.fromCodePoint(num);

const string = (num) => String(num);

const number = ({ value }) => Number(value);

const random = () => Math.random();

const time = () => new Date().toLocaleTimeString();

const id = (x) => x;

module.exports = {
  print,
  char,
  string,
  number,
  random,
  time,
  id,
};
