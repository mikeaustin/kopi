class Numeric {
  ['+'](that) {
    if (that.constructor !== this.constructor) {
      throw new Error(`Can't apply operator '+' on ${this} and ${that}`);
    }

    return this.valueOf() + that.valueOf();
  }

  ['-'](that) {
    return this - that;
  }

  ['*'](that) {
    return this * that;
  }

  ['/'](that) {
    return this / that;
  }

  ['%'](that) {
    return this % that;
  }

  //

  abs() {
    return Math.abs(this);
  }

  log() {
    return Math.log(this);
  }

  exp() {
    return Math.exp(this);
  }

  sqrt() {
    return Math.sqrt(this);
  }

  //

  floor() {
    return Math.floor(this);
  }

  ceil() {
    return Math.ceil(this);
  }

  round() {
    return Math.round(this);
  }

  //

  sin() {
    return Math.sin(this);
  }

  cos() {
    return Math.cos(this);
  }

  tan() {
    return Math.tan(this);
  }
}

module.exports = {
  default: Numeric,
  ['+']: (thisArg) => (args, scope, visitors) => Numeric.prototype['+'].apply(thisArg, [args, scope, visitors]),
  ['-']: (thisArg) => (args, scope, visitors) => Numeric.prototype['-'].apply(thisArg, [args, scope, visitors]),
  ['*']: (thisArg) => (args, scope, visitors) => Numeric.prototype['*'].apply(thisArg, [args, scope, visitors]),
  ['/']: (thisArg) => (args, scope, visitors) => Numeric.prototype['/'].apply(thisArg, [args, scope, visitors]),
  ['%']: (thisArg) => (args, scope, visitors) => Numeric.prototype['%'].apply(thisArg, [args, scope, visitors]),
  abs: (thisArg) => (args, scope, visitors) => Numeric.prototype.abs.apply(thisArg, [args, scope, visitors]),
  log: (thisArg) => (args, scope, visitors) => Numeric.prototype.log.apply(thisArg, [args, scope, visitors]),
  exp: (thisArg) => (args, scope, visitors) => Numeric.prototype.exp.apply(thisArg, [args, scope, visitors]),
  sqrt: (thisArg) => (args, scope, visitors) => Numeric.prototype.sqrt.apply(thisArg, [args, scope, visitors]),
  floor: (thisArg) => (args, scope, visitors) => Numeric.prototype.floor.apply(thisArg, [args, scope, visitors]),
  ceil: (thisArg) => (args, scope, visitors) => Numeric.prototype.ceil.apply(thisArg, [args, scope, visitors]),
  round: (thisArg) => (args, scope, visitors) => Numeric.prototype.round.apply(thisArg, [args, scope, visitors]),
  sin: (thisArg) => (args, scope, visitors) => Numeric.prototype.sin.apply(thisArg, [args, scope, visitors]),
  cos: (thisArg) => (args, scope, visitors) => Numeric.prototype.cos.apply(thisArg, [args, scope, visitors]),
  tan: (thisArg) => (args, scope, visitors) => Numeric.prototype.tan.apply(thisArg, [args, scope, visitors]),
};
