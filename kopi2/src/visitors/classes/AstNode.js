class AstNode {
  constructor(expr) {
    this.expr = expr;
  }

  escape() {
    return this.expr;
  }
}

module.exports = {
  default: AstNode,
};
