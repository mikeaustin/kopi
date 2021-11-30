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

Number.prototype.succ = function (count = 1) {
  return this + count;
};

Number.prototype.apply = function (thisArg, [func, scope, visitors]) {
  return func.apply(undefined, [this, scope, visitors]);
};

Number.prototype.negate = function (that) {
  return -this;
};

Number.prototype.even = function (that) {
  return this.valueOf() % 2 === 0;
};

Number.prototype.odd = function (that) {
  return this.valueOf() % 2 !== 0;
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

//

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

//

Number.prototype['abs'] = function () {
  return Math.abs(this);
};

Number.prototype['log'] = function () {
  return Math.log(this);
};

Number.prototype['exp'] = function () {
  return Math.exp(this);
};

Number.prototype['floor'] = function () {
  return Math.floor(this);
};

Number.prototype['ceil'] = function () {
  return Math.ceil(this);
};

Number.prototype['round'] = function () {
  return Math.round(this);
};

Number.prototype['sqrt'] = function () {
  return Math.sqrt(this);
};

//

Number.prototype['sin'] = function () {
  return Math.sin(this);
};

Number.prototype['cos'] = function () {
  return Math.cos(this);
};

Number.prototype['tan'] = function () {
  return Math.tan(this);
};

Number.prototype['_toFixed'] = function (args) {
  return new KopiString(this.toFixed(args));
};

Number.prototype['_toLocaleString'] = function (args) {
  return new KopiString(this.toLocaleString());
};
