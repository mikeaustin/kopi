const { default: KopiTuple } = require('./KopiTuple');

class _KopiVector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  ['+'](that) {
    return new _KopiVector(this.x + that.x, this.y + that.y);
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}

const KopiVector = function KopiVector(args) {
  const [x, y] = args.elements;

  return Object.create(KopiVector.prototype, {
    x: {
      value: x,
      enumerable: true,
    },
    y: {
      value: y,
      enumerable: true,
    }
  });
};

KopiVector.prototype['+'] = function (that) {
  return KopiVector(new KopiTuple([this.x + that.x, this.y + that.y]));
};

KopiVector.prototype.length = function length() {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

module.exports = {
  _KopiVector,
  default: KopiVector,
};

/*

  extend: (type) => (funcs) => {
    const prototype = Object.assign({
      ['test']: funcs.elements[0],
    }, type.prototype);

    const clone = (...args) => {
      const func = type(...args);

      Object.setPrototypeOf(func, prototype);

      return func;
    };

    clone.prototype = prototype;

    return clone;
  },

Vector = extend Vector (
  x => "hi"
  x => "bye"
)

print $ (Vector 1, 2) | test

  */
