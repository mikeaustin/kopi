class Tuple {
  constructor(elements) {
    this.elements = elements;
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

  apply(args, scope, visitors) {
    const matches = this.params.matchValue(args);

    return visitors.visitNode(this.body, { ...this.closure, ...matches });
  }
}

module.exports = {
  Tuple,
  Function
};
