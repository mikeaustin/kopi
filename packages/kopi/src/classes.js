const util = require("util");

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

class Tuple {
  constructor(elements = []) {
    this.elements = elements;
  }

  toString() {
    if (this.elements.length === 0) {
      return '()';
    }

    return `(${this.elements.map(element => element.toString()).join(', ')})`;
  }

  [util.inspect.custom]() {
    return `(${this.elements.map(element => inspect(element)).join(', ')})`;
  }

  map(mapper, scope, visitors) {
    const iters = this.elements.map(element => element[Symbol.iterator]());
    const values = [];

    let results = iters.map(iter => iter.next());

    while (results.every(result => !result.done)) {
      values.push(
        mapper.apply(undefined, [new Tuple(results.map(result => result.value)), scope, visitors])
      );

      results = iters.map(iter => iter.next());
    }

    return Promise.all(values);
  }
}

class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  [util.inspect.custom]() {
    return `${this.from}..${this.to}`;
  }

  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i = i.succ()) {
      yield i;
    }
  }

  map(args, scope, visitors) {
    return Promise.all(Array.from({ length: this.to - this.from + 1 }, (_, index) => (
      args.apply(undefined, [index + this.from, scope, visitors])
    )));
  }
}

class Function {
  constructor(params, expr, closure) {
    this.params = params;
    this.expr = expr;
    this.closure = closure;
  }

  [util.inspect.custom]() {
    return `<function>`;
  }

  apply(thisArg, [args, scope, visitors]) {
    // TODO: get unevaluated args to pass to match
    // If we pass unevaled args, we'll also need scope
    const matches = this.params.getMatches(args);

    if (matches === null) {
      return undefined;
    }

    return visitors.visitNode(this.expr, { ...this.closure, ...matches });
  }

  getMatches(args) {
    return this.params.getMatches(args);
  }
}

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
