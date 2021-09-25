Boolean.prototype.toStringAsync = function () {
  return this.toString();
};

Boolean.prototype['=='] = function (that) {
  if (typeof that !== 'boolean') {
    return false;
  }

  return this.valueOf() === that.valueOf();
};

Boolean.prototype['!='] = function (that) {
  return !this['=='](that);
};
