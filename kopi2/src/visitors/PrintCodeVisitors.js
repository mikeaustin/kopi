const { default: BaseVisitors } = require('./BaseVisitor');
const { RuntimeError } = require('../errors');
const { AstNode, IdentifierPattern, AstNodeIdentifierPattern, Tuple, Function } = require('./classes');

class PrintCodeVisitors extends BaseVisitors {
  // AstNode({ _expr }) {
  //   return new AstNode(_expr);
  // }

  // AstIdentifierNode({ _expr }) {
  //   return new AstIdentifierNode(_expr);
  // }

  // Assignment({ _pattern, _expr }, scope, bind) {
  //   const evaluatedPattern = this.visitNode(_pattern, scope);
  //   const value = this.visitNode(_expr, scope);

  //   const matches = evaluatedPattern.matchValue(value, scope);

  //   bind(matches);
  // }

  ApplyExpression({ _expr, _args }, scope) {
    // const value = this.visitNode(_expr, scope);
    // const args = this.visitNode(_args, scope);

    // return value.apply(args, scope, this);
    return `(${this.visitNode(_expr)} ${this.visitNode(_args)})`;
  }

  TupleExpression({ _elements }, scope) {
    return `(${_elements.map(element => this.visitNode(element, scope)).join(', ')})`;
  }

  FunctionExpression({ _params, _body }, scope) {
    return `${this.visitNode(_params)} => ${this.visitNode(_body)}`;
  }

  Function({ params, body }) {
    return `${this.visitNode(params)} => ${this.visitNode(body)}`;
  }

  IdentifierPattern({ _name, name }) {
    return `${_name || name}`;
  }

  // AstNodeIdentifierPattern({ _expr }) {
  //   return new AstNodeIdentifierPattern(_expr);
  // }

  NumericLiteral({ value }) {
    return `${value}`;
  }

  StringLiteral({ value }) {
    return `"${value}"`;
  }

  Identifier({ name }, scope) {
    return `${name}`;
  }
}

module.exports = {
  default: PrintCodeVisitors
};
