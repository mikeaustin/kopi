const { Tuple, Range, Function, TuplePattern, IdentifierPattern, NumericLiteralPattern, FunctionPattern } = require('./classes');

class Visitors {
  visit(astNode, scope, bind) {
    if (this[astNode.constructor.name]) {
      return this[astNode.constructor.name](astNode, scope, bind);
    } else {
      throw new Error(`No AST visitor for '${astNode.constructor.name}'`);
    }
  }
}

class InterpreterVisitors extends Visitors {
  Assignment({ pattern, expr }, scope, bind) {
    const evaluatedExpr = this.visit(expr, scope);
    const evaluatedPattern = this.visit(pattern, scope);

    // TODO: pass expr directly so FunctionPattern can use it as body
    const matches = evaluatedPattern.match(evaluatedExpr, scope, expr);

    bind(matches);
  }

  ApplyExpression({ expr, args }, scope) {
    const evaluatedArgs = this.visit(args, scope);
    const evaluatedExpr = this.visit(expr, scope);

    // console.log(evaluatedArgs);

    return evaluatedExpr.apply(undefined, [evaluatedArgs], this);
  }

  FunctionExpression({ params, expr }, scope) {
    const evaluatedParams = this.visit(params, scope);

    return new Function(evaluatedParams, expr, scope);
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

  TuplePattern({ elements }) {
    return new TuplePattern(elements);
  }

  IdentifierPattern({ name }) {
    return new IdentifierPattern(name);
  }

  NumericLiteralPattern({ value }) {
    return new NumericLiteralPattern(value);
  }

  FunctionPattern({ name, params }, scope) {
    const evaluatedParams = this.visit(params, scope);

    return new FunctionPattern(name, evaluatedParams);
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
