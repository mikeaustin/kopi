const { default: BaseVisitors } = require('./BaseVisitor');

class BaseError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
  }
}

class InterpreterError extends BaseError { }
class RuntimeError extends BaseError { }


Object.prototype.inspect = function () {
  return JSON.stringify(this);
};

class Function {
  constructor(closure, params, body) {
    this.closure = closure;
    this.params = params;
    this.body = body;
  }

  apply(args, scope, visitors) {
    const matches = this.params.matchValue(args);

    return visitors.visitNode(this.body, { ...this.closure, ...matches });
  }
}

class InterpreterVisitors extends BaseVisitors {
  Assignment({ left, right }, scope, bind) {
    const value = this.visitNode(right, scope);

    const matches = left.matchValue(value, scope);

    bind(matches);
  }

  ApplyExpression({ expr, args }, scope) {
    const evaluatedExpr = this.visitNode(expr, scope);
    const evaluatedArgs = this.visitNode(args, scope);

    return evaluatedExpr.apply(evaluatedArgs, scope, this);
  }

  FunctionExpression({ params, body }, scope) {
    return new Function(scope, params, body);
  }

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
  default: InterpreterVisitors
};
