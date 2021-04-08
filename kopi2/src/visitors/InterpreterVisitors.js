const { default: BaseVisitors } = require('./BaseVisitor');
const { RuntimeError } = require('../errors');
const { AstNode, IdentifierPattern, AstNodeIdentifierPattern, Tuple, Function } = require('./classes');

class InterpreterVisitors extends BaseVisitors {
  AstNode({ _expr }) {
    return new AstNode(_expr);
  }

  AstIdentifierNode({ _expr }) {
    return new AstIdentifierNode(_expr);
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

  AstNodeIdentifierPattern({ _expr }) {
    return new AstNodeIdentifierPattern(_expr);
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
