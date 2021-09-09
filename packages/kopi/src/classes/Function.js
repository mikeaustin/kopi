const util = require("util");

class Function {
  constructor(params, expr, closure) {
    this.params = params;
    this.expr = expr;
    this.closure = closure;
  }

  [util.inspect.custom]() {
    return `<function>`;
  }

  apply(thisArg, [args, scope, visitors]) {
    // TODO: get unevaluated args to pass to match
    // If we pass unevaled args, we'll also need scope
    const matches = this.params.getMatches(args);

    if (matches === null) {
      return undefined;
    }

    return visitors.visitNode(this.expr, { ...this.closure, ...matches });
  }

  getMatches(args) {
    return this.params.getMatches(args);
  }
}

module.exports = {
  default: Function,
};
