const { TupleType, FunctionType } = require('./types');

class AstNode {
  constructor(expr) {
    this.expr = expr;
  }

  escape() {
    return this.name;
  }
}


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

class Tuple {
  constructor(...elements) {
    this.elements = elements;

    elements.forEach((element, index) => {
      this[index] = element;
    });
  }

  get type() {
    return TupleType(...this.elements.map(element => element.type));
  }

  escape() {
    return `(${this.elements.map(element => element.escape()).join(', ')})`;
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

    Object.defineProperty(this, 'toString', {
      value: undefined,
    });
  }

  escape() {
    return `<function>`;
  }

  get type() {
    return FunctionType(this.params, this.rettype);
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
