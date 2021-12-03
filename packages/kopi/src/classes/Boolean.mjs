Boolean.prototype.inspectAsync = function () {
  return `${this}`;
};

Boolean.prototype.toStringAsync = function () {
  return this.inspectAsync();
};

Boolean.prototype.not = function (that) {
  return !this.valueOf();
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
