const util = require("util");

const { default: KopiString } = require('./KopiString');
const { default: KopiTuple } = require('./KopiTuple');

Array.prototype.inspectAsync = async function () {
  const elements = await Promise.all(
    this.map(async element => (await element).inspectAsync())
  );

  return `[${elements.join(', ')}]`;
};

Array.prototype.toStringAsync = function () {
  return this.inspectAsync();
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

Array.prototype._join = async function (delimiter = new KopiString("")) {
  const elements = await Promise.all(this);

  return new KopiString(elements.map(element => element.getNativeString()).join(delimiter.getNativeString()));
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
    const appliedElement = await func.apply(undefined, [element, scope, visitors]);

    if (appliedElement[Symbol.iterator]) {
      accum.push(...appliedElement);
    } else {
      accum.push(appliedElement);
    }
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

Array.prototype._find = async function (func, scope, visitors) {
  for (const element of this) {
    if (await func.apply(undefined, [await element, scope, visitors])) {
      return await element;
    }
  }

  return KopiTuple.empty;
};
