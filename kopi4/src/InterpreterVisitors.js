const util = require("util");

class Tuple {
  constructor(elements) {
    this.elements = elements;
  }

  [util.inspect.custom]() {
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

class Visitors {
  visit(node, scope) {
    if (this[node.constructor.name]) {
      return this[node.constructor.name](node, scope);
    } else {
      throw new Error(`No AST visitor for '${node.constructor.name}'`);
    }
  }
}

class InterpreterVisitors extends Visitors {
  ApplyExpression({ expr, args }, scope) {
    const evaluatedArgs = this.visit(args, scope);
    const evaluatedExpr = this.visit(expr, scope);

    // console.log(evaluatedArgs);

    return evaluatedExpr.apply(undefined, [evaluatedArgs], this);
  }

  FunctionExpression({ params, expr }, scope) {
    return new Function(params, expr, scope);
  }

  TupleExpression({ elements }, scope) {
    return new Tuple(elements.map(element => this.visit(element, scope)));
  }

  RangeExpression({ from, to }, scope) {
    return new Range(this.visit(from, scope), this.visit(to, scope));
  }

  OperatorExpression({ op, left, right }, scope) {
    const evaluatedLeft = this.visit(left, scope);
    const evaluatedRight = this.visit(right, scope);

    switch (op) {
      case '+': return evaluatedLeft + evaluatedRight;
      case '-': return evaluatedLeft - evaluatedRight;
      case '*': return evaluatedLeft * evaluatedRight;
      case '/': return evaluatedLeft / evaluatedRight;
    }
  }

  NumericLiteral({ value }) {
    return value;
  }

  Identifier({ name }, scope) {
    return scope[name];
  }
}

module.exports = {
  default: new InterpreterVisitors(),
};
