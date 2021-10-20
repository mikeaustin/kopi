const util = require("util");

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

Array.prototype['++'] = function (that) {
  return this.concat(that.toArray());
};

Array.prototype._join = async function (delimiter = "") {
  const elements = await Promise.all(this);

  return elements.join(delimiter);
};

Array.prototype._map = async function (args, scope, visitors) {
  const values = [];

  for (const element of this) {
    values.push(await args.apply(undefined, [element, scope, visitors]));
  }

  return values;
};

Array.prototype._reduce = function (init) {
  return async (func, scope, visitors) => {
    let accum = init;

    for (const element of this) {
      accum = await func.apply(undefined, [new KopiTuple([accum, element]), scope, visitors]);
    }

    return accum;
  };
};

Array.prototype._reverse = async function (args, scope, visitors) {
  return [...this].reverse();
};
