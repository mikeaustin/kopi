class IdentifierPattern {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  escape() {
    return this.name;
  }

  matchValue(value) {
    return {
      [this.name]: value
    };
  }

  matchType(type) {
    // console.log('IdentifierPattern.matchType()', this.type, type);

    if (this.type && !this.type.includesType(type)) {
      return null;
    }

    return {
      [this.name]: type
    };
  }
}

module.exports = {
  default: IdentifierPattern,
};
