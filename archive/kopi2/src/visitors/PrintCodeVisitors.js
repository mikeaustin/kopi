const { default: BaseVisitors } = require('./BaseVisitor');

class PrintCodeVisitors extends BaseVisitors {
  AstNode({ _expr }) {
    return `('${this.visitNode(_expr)})`;
  }

  // AstIdentifierNode({ _expr }) {
  //   return new AstIdentifierNode(_expr);
  // }

  Assignment({ _pattern, _expr }, scope, bind) {
    return `${this.visitNode(_pattern)} = ${this.visitNode(_expr)}`;
  }

  ApplyExpression({ _expr, _args }, scope) {
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
