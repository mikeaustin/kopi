const { default: PrintCodeVisitors } = require('../PrintCodeVisitors');

const visitors = new PrintCodeVisitors();

class AstNode {
  constructor(expr) {
    this.expr = expr;
  }

  escape() {
    return `'${visitors.visitNode(this.expr)}`;
  }

  toString() {
    return `'${visitors.visitNode(this.expr)}`;
  }
}

module.exports = {
  default: AstNode,
};
