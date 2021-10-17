const util = require("util");

String.prototype.toStringAsync = function () {
  return this.toString();
};

String.prototype[util.inspect.custom] = function () {
  return `"${this}"`;
};

String.prototype.succ = function () {
  return String.fromCodePoint(this.codePointAt(0) + 1);
};

String.prototype._split = function (delimiter = "") {
  return this.split(delimiter);
};

String.prototype['++'] = function (that) {
  if (typeof that !== 'string') {
    throw new Error(`Can't concat string with ${that.constructor.name}`);
  }

  return this.concat(that);
};

String.prototype['=='] = function (that) {
  if (typeof that !== 'string') {
    return false;
  }

  return this.valueOf() === that.valueOf();
};

String.prototype['!='] = function (that) {
  return !this['=='](that);
};
