class Tuple {
  constructor(elements) {
    this.elements = elements;
  }
}

class Function {
  constructor(params, expr, closure) {
    this.params = params;
    this.expr = expr;
    this.closure = closure;
  }

  apply(thisArg, args, visitors) {
    // const scope = this.params.reduce((scope, param, index) => ({
    //   ...scope,
    //   [param.name]: args[index]
    // }), this.closure);

    const scope = {
      ...this.closure,
      [this.params.name]: args[0]
    };

    return visitors.visit(this.expr, scope);
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

  TupleExpression({ elements }, scope) {
    return new Tuple(elements.map(element => this.visit(element, scope)));
  }

  FunctionExpression({ params, expr }, scope) {
    return new Function(params, expr, scope);
  }

  ApplyExpression({ expr, args }, scope) {
    const evaluatedArgs = this.visit(args, scope);
    const evaluatedExpr = this.visit(expr, scope);

    // console.log(evaluatedArgs);

    return evaluatedExpr.apply(undefined, [evaluatedArgs], this);
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
