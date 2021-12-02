import KopiString from './KopiString.mjs';
import _Comparable from '../traits/Comparable.js';
import _Numeric from '../traits/Numeric.js';

const { default: Comparable } = _Comparable;
const { default: Numeric } = _Numeric;

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

//

Number.prototype.compare = function (that) {
  return 0;
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

//

Number.prototype['_toFixed'] = function (args) {
  return new KopiString(this.toFixed(args));
};

Number.prototype['_toLocaleString'] = function (args) {
  return new KopiString(this.toLocaleString());
};

Number.prototype['+'] = Numeric.prototype['+'];
Number.prototype['-'] = Numeric.prototype['-'];
Number.prototype['*'] = Numeric.prototype['*'];
Number.prototype['/'] = Numeric.prototype['/'];
Number.prototype['%'] = Numeric.prototype['%'];

Number.prototype.abs = Numeric.prototype.abs;
Number.prototype.log = Numeric.prototype.log;
Number.prototype.exp = Numeric.prototype.exp;
Number.prototype.sqrt = Numeric.prototype.sqrt;

Number.prototype.floor = Numeric.prototype.floor;
Number.prototype.ceil = Numeric.prototype.ceil;
Number.prototype.round = Numeric.prototype.round;

Number.prototype.sin = Numeric.prototype.sin;
Number.prototype.cos = Numeric.prototype.cos;
Number.prototype.tan = Numeric.prototype.tan;

// Number.prototype['<'] = Numeric(Number.prototype.compare);
