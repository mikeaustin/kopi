class Tuple {
  constructor(elements) {
    this.elements = elements;
  }

  inspect() {
    return `(${this.elements.map(element => element.inspect()).join(', ')})`;
  }
}

class Function {
  constructor(closure, params, body) {
    this.closure = closure;
    this.params = params;
    this.body = body;
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
