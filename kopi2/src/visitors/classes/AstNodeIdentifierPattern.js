class AstNodeIdentifierPattern {
  constructor(expr) {
    this.expr = expr;
  }

  escape() {
    return this.expr;
  }

  matchValue(value) {
    return null;
  }

  matchType(type) {
    if (type.name !== this.expr._name) {
      throw Error(`Match expects identifier pattern '${this.expr._name}', but got '${type.name}'`);
    }
  }
}

module.exports = {
  default: AstNodeIdentifierPattern,
};
