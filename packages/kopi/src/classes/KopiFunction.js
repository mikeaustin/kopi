const util = require('util');

class KopiFunction {
  constructor(params, expr, closure) {
    this.params = params;
    this.expr = expr;
    this.closure = closure;
  }

  inspectAsync() {
    return '<function>';
  }

  toStringAsync() {
    return this.inspectAsync();
  }

  async apply(thisArg, [args, scope, visitors]) {
    const matches = await this.params.getMatches(args, scope, visitors);

    if (matches === null) {
      return undefined;
    }

    return visitors.visitNode(this.expr, {
      ...this.closure,
      ...matches,
      _coroutineId: scope._coroutineId,
    });
  }

  async getMatches(args) {
    return this.params.getMatches(args);
  }
}

module.exports = {
  default: KopiFunction,
};
