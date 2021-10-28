const util = require("util");

const { default: KopiString } = require('./KopiString');
const { default: KopiTuple } = require('./KopiTuple');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

Array.prototype.toStringAsync = async function () {
  const elements = await Promise.all(
    this.map(async element => inspect(await element))
  );

  return `[${elements.join(', ')}]`;
};

Array.prototype[util.inspect.custom] = function () {
  return `[${this.map(element => inspect(element)).join(', ')}]`;
};

Array.prototype.toArray = function () {
  return this;
};

Array.prototype._get = function (index) {
  if (index.constructor.name === 'KopiRange') {
    return this.slice(index.from, index.to);
  }

  return this[index];
};

Array.prototype.apply = function (thisArg, [index]) {
  if (index < 0) {
    index = this.length - 1 - index;
  }

  return (value, scope, visitors) => {
    const result = [...this];

    if (index.constructor.name === 'KopiRange') {
      result.splice(index.from, index.to - index.from, ...value);
    } else if (value.constructor.name === 'KopiFunction') {
      result[index] = value.apply(undefined, [this[index], scope, visitors]);
    } else {
      result.splice(index, 0, ...value);
    }

    return result;
  };
};

Array.prototype._length = function () {
  return this.length;
};

Array.prototype['++'] = function (that) {
  return this.concat(that.toArray());
};

Array.prototype._join = async function (delimiter = "") {
  const elements = await Promise.all(this);

  return new KopiString(elements.join(delimiter));
};

Array.prototype._map = async function (func, scope, visitors) {
  const values = [];

  for (const element of this) {
    values.push(await func.apply(undefined, [await element, scope, visitors]));
  }

  return values;
};

Array.prototype._flatMap = async function (func, scope, visitors) {
  let accum = [];
  let index = 0;

  for (const element of this) {
    accum.push(...await func.apply(undefined, [await element, scope, visitors]));
  }

  return accum;
};

Array.prototype._reduce = function (init) {
  return async (func, scope, visitors) => {
    let accum = init;
    let index = 0;

    for (const element of this) {
      accum = await func.apply(undefined, [new KopiTuple([accum, await element, index++]), scope, visitors]);
    }

    return accum;
  };
};

Array.prototype._reverse = async function (args, scope, visitors) {
  return [...this].reverse();
};
