const util = require("util");

class KopiFunction {
  constructor(params, expr, closure) {
    this.params = params;
    this.expr = expr;
    this.closure = closure;
  }

  [util.inspect.custom]() {
    return `<function>`;
  }

  apply(thisArg, [args, scope, visitors]) {
    const matches = this.params.getMatches(args);

    if (matches === null) {
      return undefined;
    }

    return visitors.visitNode(this.expr, { ...this.closure, ...matches, _coroutineId: scope._coroutineId });
  }

  getMatches(args) {
    return this.params.getMatches(args);
  }
}

module.exports = {
  default: KopiFunction,
};
