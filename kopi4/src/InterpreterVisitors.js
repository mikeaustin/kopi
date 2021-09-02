const { Tuple, Range, Function, TuplePattern, IdentifierPattern, NumericLiteralPattern, FunctionPattern } = require('./classes');

class Visitors {
  visitNode(astNode, scope, bind) {
    if (!astNode) {
      return;
    }

    if (this[astNode.constructor.name]) {
      return this[astNode.constructor.name](astNode, scope, bind);
    } else {
      throw new Error(`No AST visitor for '${astNode.constructor.name}'`);
    }
  }
}

class InterpreterVisitors extends Visitors {
  Block({ statements }, scope) {
    const bind = updates => scope = ({ ...scope, ...updates });

    return statements.reduce((result, statement) => this.visitNode(statement, scope, bind), undefined);
  }

  Assignment({ pattern, expr }, scope, bind) {
    const evaluatedExpr = this.visitNode(expr, scope);
    const evaluatedPattern = this.visitNode(pattern, scope);

    // TODO: pass expr directly so FunctionPattern can use it as body
    const matches = evaluatedPattern.getMatches(evaluatedExpr, scope, expr);

    bind(matches);
  }

  PipeExpression({ left, right }, scope) {
    const evaluatedExpr = this.visitNode(left, scope);
    const evaluatedArgs = this.visitNode(right.args, scope);

    return evaluatedExpr[right.expr.name].apply(evaluatedExpr, [evaluatedArgs, this], scope);
  }

  ApplyExpression({ expr, args }, scope) {
    const evaluatedArgs = this.visitNode(args, scope);
    const evaluatedExpr = this.visitNode(expr, scope);

    // console.log(evaluatedArgs);

    // TODO: Passing unevaluated args, FunctionPattern can store expr
    return evaluatedExpr.apply(undefined, [evaluatedArgs, this]);
  }

  FunctionExpression({ params, expr }, scope) {
    const evaluatedParams = this.visitNode(params, scope);

    return new Function(evaluatedParams, expr, scope);
  }

  TupleExpression({ elements }, scope) {
    return new Tuple(elements.map(element => this.visitNode(element, scope)));
  }

  RangeExpression({ from, to }, scope) {
    return new Range(this.visitNode(from, scope), this.visitNode(to, scope));
  }

  OperatorExpression({ op, left, right }, scope) {
    const evaluatedLeft = this.visitNode(left, scope);
    const evaluatedRight = this.visitNode(right, scope);

    if (typeof evaluatedLeft === 'number' && typeof evaluatedRight === 'number') {
      switch (op) {
        case '+': return evaluatedLeft + evaluatedRight;
        case '-': return evaluatedLeft - evaluatedRight;
        case '*': return evaluatedLeft * evaluatedRight;
        case '/': return evaluatedLeft / evaluatedRight;
      }
    }

    return evaluatedLeft[op].apply(evaluatedLeft, [evaluatedRight]);
  }

  //

  TuplePattern({ elements }, scope) {
    return new TuplePattern(elements.map(element => this.visitNode(element, scope)));
  }

  IdentifierPattern({ name, init }, scope) {
    return new IdentifierPattern(name, this.visitNode(init, scope));
  }

  NumericLiteralPattern({ value }) {
    return new NumericLiteralPattern(value);
  }

  FunctionPattern({ name, params }, scope) {
    const evaluatedParams = this.visitNode(params, scope);

    return new FunctionPattern(name, evaluatedParams);
  }

  //

  NumericLiteral({ value }) {
    return value;
  }

  StringLiteral({ value }) {
    return value;
  }

  Identifier({ name }, scope) {
    return scope[name];
  }
}

module.exports = {
  default: new InterpreterVisitors(),
};
