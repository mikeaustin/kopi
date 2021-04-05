const { default: BaseVisitors } = require('./BaseVisitor');
const { RuntimeError } = require('../errors');
const { IdentifierPattern, Tuple, Function } = require('./classes');

Object.prototype.inspect = function () {
  return JSON.stringify(this);
};

class InterpreterVisitors extends BaseVisitors {
  Assignment({ pattern, expr }, scope, bind) {
    const value = this.visitNode(expr, scope);
    const matches = pattern.matchValue(value, scope);

    bind(matches);
  }

  ApplyExpression({ expr, args }, scope) {
    const value = this.visitNode(expr, scope);
    const arg = this.visitNode(args, scope);

    return value.apply(arg, scope, this);
  }

  TupleExpression({ elements }, scope) {
    return new Tuple(elements.map(element => this.visitNode(element, scope)));
  }

  FunctionExpression({ params, body }, scope) {
    this.visitNode(params, scope);

    return new Function(this.visitNode(params, scope), body, scope);
  }

  IdentifierPattern({ name }) {
    return new IdentifierPattern(name);
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
