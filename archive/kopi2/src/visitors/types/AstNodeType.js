class AstNodeType {
  get name() {
    return `AstNode`;
  }

  escape() {
    return this.name;
  }
}

module.exports = {
  AstNodeType,
};
