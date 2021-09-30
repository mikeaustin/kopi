Number.prototype.toStringAsync = function () {
  return this.toString();
};

Number.prototype.succ = function () {
  return this + 1;
};

Number.prototype['+'] = function (that) {
  return this + that;
};

Number.prototype['*'] = function (that) {
  return this * that;
};

Number.prototype['*'] = function (that) {
  return this + that;
};

Number.prototype['/'] = function (that) {
  return this * that;
};

Number.prototype['%'] = function (that) {
  return this * that;
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
