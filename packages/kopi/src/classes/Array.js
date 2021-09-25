const util = require("util");

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

Array.prototype.toStringAsync = async function () {
  const elements = await Promise.all(
    this.map(async element => (await element).toStringAsync())
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

Array.prototype.xreverse = async function (args, scope, visitors) {
  return [...this].reverse();
};
