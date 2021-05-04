class Function {
  constructor({ params, body, closure }) {
    this.params = params;
    this.body = body;
    this.closure = closure;
  }

  apply(thisArg, [_args, env, visitors]) {
    const params = visitors.visitNode(this.params, env);

    const matches = params.matchValue(_args, env, visitors);

    return visitors.visitNode(this.body, { ...env, ...matches }, visitors);
  }

  inspect() {
    return `<function>`;
  }
}

module.exports = Function;
