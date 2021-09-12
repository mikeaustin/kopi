const util = require("util");

const { default: KopiString } = require('./classes/KopiString');
const { default: KopiTuple } = require('./classes/KopiTuple');
const { default: KopiRange } = require('./classes/KopiRange');
const { default: KopiFunction } = require('./classes/KopiFunction');
const { default: KopiVector } = require('./classes/KopiVector');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

//

Number.prototype.succ = function () {
  return this + 1;
};

String.prototype[util.inspect.custom] = function () {
  return `"${this}"`;
};

String.prototype.succ = function () {
  return String.fromCodePoint(this.codePointAt(0) + 1);
};

String.prototype['++'] = function (that) {
  return this.concat(that);
};

Array.prototype.toString = function () {
  return `[${this.map(element => element.toString()).join(', ')}]`;
};

Array.prototype[util.inspect.custom] = function () {
  return `[${this.map(element => inspect(element)).join(', ')}]`;
};

Array.prototype.xmap = function (args, scope, visitors) {
  return Promise.all(this.map((element) => (
    args.apply(undefined, [element, scope, visitors])
  )));
};

//

class TuplePattern {
  constructor(elements) {
    this.elements = elements;
  }

  getMatches(value) {
    const matchesArray = this.elements.map((element, index) => element.getMatches(value.elements[index] ?? KopiTuple.empty));

    if (matchesArray.some(match => match === null)) {
      return null;
    }

    return matchesArray.reduce((scope, matches) => ({
      ...scope,
      ...matches,
    }), {});
  }
}

class IdentifierPattern {
  constructor(name, init) {
    this.name = name;
    this.init = init;
  }

  getMatches(value) {
    return {
      [this.name]: value === KopiTuple.empty ? this.init : value,
    };
  }
}

class NumericLiteralPattern {
  constructor(value) {
    this.value = value;
  }

  getMatches(value) {
    if (value !== this.value) {
      return null;
    }

    return {};
  }
}

class StringLiteralPattern {
  constructor(value) {
    this.value = value;
  }

  getMatches(value) {
    if (value !== this.value) {
      return null;
    }

    return {};
  }
}

class ConstructorPattern {
  constructor(name, pattern) {
    this.name = name;
    this.pattern = pattern;
  }

  getMatches(value) {
    console.log('>>>', value);

    if (value.constructor.name !== this.name) {
      return null;
    }

    return {};

    //   if (value !== this.value) {
    //     return null;
    //   }

    //   return {};
  }
}

class FunctionPattern {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }

  getMatches(value, scope, unevaluatedValue) {
    return {
      [this.name]: new KopiFunction(this.params, unevaluatedValue, scope)
    };
  }
}

module.exports = {
  KopiString,
  KopiTuple,
  KopiRange,
  KopiFunction,
  KopiVector,
  TuplePattern,
  IdentifierPattern,
  NumericLiteralPattern,
  StringLiteralPattern,
  ConstructorPattern,
  FunctionPattern,
};
