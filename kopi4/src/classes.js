const util = require("util");

class Tuple {
  constructor(elements = []) {
    this.elements = elements;
  }

  [util.inspect.custom]() {
    if (this.elements.length === 0) {
      return '()';
    }

    return `${this.elements.join(', ')}`;
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
  constructor(name) {
    this.name = name;
  }

  match(value) {
    return {
      [this.name]: value
    };
  }
}

class NumericLiteralPattern {
  constructor(value) {
    this.value = value;
  }

  match(value) {
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
