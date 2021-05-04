class IdentifierPattern {
  constructor({ name }) {
    this.name = name;
  }

  matchValue(_expr, env, visitors) {
    const value = visitors.visitNode(_expr, env);

    return {
      [this.name]: value
    };
  }
}

module.exports = IdentifierPattern;
