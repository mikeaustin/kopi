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

  matchType(_expr, context, visitors) {
    const type = visitors.visitNode(_expr, context);

    return {
      [this.name]: type
    };
  }
}

module.exports = IdentifierPattern;
