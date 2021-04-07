const { default: BaseVisitors } = require('./BaseVisitor');
const { RuntimeError } = require('../errors');
const { IdentifierPattern, Tuple, Function } = require('./classes');

Object.prototype.inspect = function () {
  return JSON.stringify(this);
};

class InterpreterVisitors extends BaseVisitors {
  AstNode({ _expr }) {
    return _expr;
  }

  Assignment({ _pattern, _expr }, scope, bind) {
    const evaluatedPattern = this.visitNode(_pattern, scope);
    const value = this.visitNode(_expr, scope);

    const matches = evaluatedPattern.matchValue(value, scope);

    bind(matches);
  }

  ApplyExpression({ _expr, _args }, scope) {
    const value = this.visitNode(_expr, scope);
    const args = this.visitNode(_args, scope);

    return value.apply(args, scope, this);
  }

  TupleExpression({ _elements }, scope) {
    return new Tuple(..._elements.map(element => this.visitNode(element, scope)));
  }

  FunctionExpression({ _params, _body }, scope) {
    return new Function(this.visitNode(_params, scope), undefined, _body, scope);
  }

  IdentifierPattern({ _name }) {
    return new IdentifierPattern(_name);
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
