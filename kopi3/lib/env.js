Number.prototype.inspect = function () {
  return `${this}`;
};

String.prototype.inspect = function () {
  return `"${this}"`;
};

const env = {
  version: '0.0.1'
};

module.exports = env;
