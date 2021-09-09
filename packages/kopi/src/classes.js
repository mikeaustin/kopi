const util = require("util");

const { default: Tuple } = require('./classes/Tuple');
const { default: Range } = require('./classes/Range');
const { default: Function } = require('./classes/Function');

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

Array.prototype.toString = function () {
  return `[${this.map(element => element.toString()).join(', ')}]`;
};

Array.prototype[util.inspect.custom] = function () {
  return `[${this.map(element => inspect(element)).join(', ')}]`;
};

//

class TuplePattern {
  constructor(elements) {
    this.elements = elements;
  }

  getMatches(value) {
    const matchesArray = this.elements.map((element, index) => element.getMatches(value.elements[index]));

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
      [this.name]: value ?? this.init,
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

class FunctionPattern {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }

  getMatches(value, scope, unevaluatedValue) {
    return {
      [this.name]: new Function(this.params, unevaluatedValue, scope)
    };
  }
}

module.exports = {
  Tuple,
  Range,
  Function,
  TuplePattern,
  IdentifierPattern,
  NumericLiteralPattern,
  StringLiteralPattern,
  FunctionPattern,
};
