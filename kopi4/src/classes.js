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
    const matchs = this.params.match(args[0]);

    return visitors.visit(this.expr, { ...this.closure, ...matchs });
  }
}

module.exports = {
  Tuple,
  Range,
  Function,
};
