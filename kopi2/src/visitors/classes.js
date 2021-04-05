class IdentifierPattern {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  inspect() {
    return this.name;
  }

  matchValue(value) {
    return {
      [this.name]: value
    };
  }

  matchType(type) {
    if (this.type && type !== this.type) {
      return null;
    }

    return {
      [this.name]: type
    };
  }
}

class Tuple {
  constructor(elements) {
    this.elements = elements;
  }

  get name() {
    return `(${this.elements.map(element => element.name).join(', ')})`;
  }

  inspect() {
    return `(${this.elements.map(element => element.inspect()).join(', ')})`;
  }
}

class Function {
  constructor(params, body, scope) {
    this.params = params;
    this.body = body;
    this.closure = scope;
  }

  get name() {
    return `(${this.params.map(param => param.name).join(', ')}) => ${0}`;
  }

  apply(args, scope, visitors) {
    const matches = this.params.matchValue(args);

    return visitors.visitNode(this.body, { ...this.closure, ...matches });
  }
}

module.exports = {
  IdentifierPattern,
  Tuple,
  Function
};
