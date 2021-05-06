class FunctionType {
  get name() {
    return `Function`;
  }

  constructor({ params, rettype, body, context }) {
    this.params = params;
    this.rettype = rettype;
    this.body = body;
    this.context = context;
  }

  isSupertypeOf(type) {
    return false;
  }

  isSubtypeOf(type) {
    return true;
  }
}

module.exports = FunctionType;
