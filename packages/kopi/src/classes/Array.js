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

Array.prototype._join = async function (args) {
  const elements = await Promise.all(this);

  return elements.join(args);
};

Array.prototype._map = async function (args, scope, visitors) {
  const values = [];

  for (const element of this) {
    values.push(await args.apply(undefined, [element, scope, visitors]));
  }

  return values;
};

Array.prototype._reduce = async function ({ elements: [_func, init] }, scope, visitors) {
  const func = await _func;
  let value = await init;

  for (const element of this) {
    value = await func.apply(undefined, [new KopiTuple([value, element]), scope, visitors]);
  }

  return value;
};

Array.prototype._reduce2 = function (init) {
  return async (_func, scope, visitors) => {
    const func = await _func;
    let value = await init;

    for (const element of this) {
      value = await func.apply(undefined, [new KopiTuple([value, element]), scope, visitors]);
    }

    return value;
  };
};

Array.prototype._reverse = async function (args, scope, visitors) {
  return [...this].reverse();
};
