const util = require("util");

class Function {
  constructor(params, rettype, body, scope) {
    this.params = params;
    this.rettype = rettype;
    this.body = body;
    this.closure = scope;

    if (this.closure) this.closure[util.inspect.custom] = () => {
      return '{ ... }';
    };

    Object.defineProperty(this, 'toString', {
      value: undefined,
    });
  }

  escape() {
    return `<function>`;
  }

  // get type() {
  //   return FunctionType(this.params, this.rettype);
  // }

  apply(args, scope, visitors) {
    const matches = this.params.matchValue(args);

    return visitors.visitNode(this.body, { ...this.closure, ...matches });
  }
}

module.exports = {
  default: Function,
};
