class AstNode {

}

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
    if (this.type && !this.type.includesType(type)) {
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

  inspect() {
    return `(${this.elements.map(element => element.inspect()).join(', ')})`;
  }

  toString() {
    return `${this.elements.join(', ')}`;
  }
}

class Function {
  constructor(params, rettype, body, scope) {
    this.params = params;
    this.rettype = rettype;
    this.body = body;
    this.closure = scope;
  }

  get name() {
    return `${this.params.type?.name} => ${this.rettype?.name}`;
  }

  inspect() {
    return this.name;
  }

  toString() {
    return `<Function>`;
  }

  apply(args, scope, visitors) {
    const matches = this.params.matchValue(args);

    return visitors.visitNode(this.body, { ...this.closure, ...matches });
  }
}

module.exports = {
  AstNode,
  IdentifierPattern,
  Tuple,
  Function
};
