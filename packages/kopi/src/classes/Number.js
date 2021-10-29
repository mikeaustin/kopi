const { default: KopiString } = require('./KopiString');

Number.prototype.inspectAsync = function () {
  return `${this}`;
};

Number.prototype.toStringAsync = function () {
  return this.inspectAsync();
};

Number.prototype._toString = function () {
  return new KopiString(`${this}`);
};

Number.prototype.succ = function () {
  return this + 1;
};

Number.prototype['+'] = function (that) {
  return this + that;
};

Number.prototype['-'] = function (that) {
  return this - that;
};

Number.prototype['*'] = function (that) {
  return this * that;
};

Number.prototype['/'] = function (that) {
  return this / that;
};

Number.prototype['%'] = function (that) {
  return this % that;
};

Number.prototype['=='] = function (that) {
  if (typeof that !== 'number') {
    return false;
  }

  return this.valueOf() === that.valueOf();
};

Number.prototype['!='] = function (that) {
  return !this['=='](that);
};

Number.prototype['<'] = function (that) {
  return this < that;
};

Number.prototype['>'] = function (that) {
  return this > that;
};

Number.prototype['<='] = function (that) {
  return this <= that;
};

Number.prototype['>='] = function (that) {
  return this >= that;
};

Number.prototype['sqrt'] = function () {
  return Math.sqrt(this);
};

Number.prototype['_toFixed'] = function (args) {
  return new KopiString(this.toFixed(args));
};
