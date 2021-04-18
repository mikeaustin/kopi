class AstNode {
  constructor(expr) {
    this.expr = expr;
  }

  escape() {
    return this.name;
  }
}

module.exports = {
  default: AstNode,
};
