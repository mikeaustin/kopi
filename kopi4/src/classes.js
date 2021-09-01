const util = require("util");

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

class Tuple {
  constructor(elements = []) {
    this.elements = elements;
  }

  toString() {
    if (this.elements.length === 0) {
      return '()';
    }

    return `(${this.elements.map(element => inspect(element)).join(', ')})`;
  }

  [util.inspect.custom]() {
    return this.toString();
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

  map(args, visitors) {
    return Array.from({ length: this.to - this.from + 1 }, (_, index) => (
      args.apply(undefined, [index + this.from], visitors)
    ));
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

  apply(thisArg, args, visitors) {
    // TODO: get unevaluated args to pass to match
    // If we pass unevaled args, we'll also need scope
    const matchs = this.params.match(args[0]);

    return visitors.visit(this.expr, { ...this.closure, ...matchs });
  }
}

//

class TuplePattern {
  constructor(elements) {
    this.elements = elements;
  }

  match(value) {
    return this.elements.reduce((scope, element, index) => ({
      ...scope,
      ...element.match(value.elements[index]),
    }), {});
  }
}

class IdentifierPattern {
  constructor(name, init) {
    this.name = name;
    this.init = init;
  }

  match(value) {
    return {
      [this.name]: value ?? this.init,
    };
  }
}

class NumericLiteralPattern {
  constructor(value) {
    this.value = value;
  }

  match(value) {
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

  match(value, scope, unevaluatedValue) {
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
  FunctionPattern,
};
