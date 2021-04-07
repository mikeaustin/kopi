class AstNode {
  constructor(expr) {
    this.expr = expr;
  }
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

class AstNodeIdentifierPattern {
  constructor(expr) {
    this.expr = expr;
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

class Tuple {
  constructor(...elements) {
    this.elements = elements;

    elements.forEach((element, index) => {
      this[index] = element;
    });
  }

  inspect() {
    return `(${this.elements.map(element => element.inspect()).join(', ')})`;
  }

  toString() {
    return `${this.elements.join(', ')}`;
  }
}

class Function {
  constructor(params, type, body, scope) {
    this.params = params;
    this.type = type;
    this.body = body;
    this.closure = scope;
  }

  get name() {
    return `${this.params.type?.name} => ${this.type?.name}`;
  }

  // inspect() {
  //   return this.name;
  // }

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
  AstNodeIdentifierPattern,
  Tuple,
  Function
};
