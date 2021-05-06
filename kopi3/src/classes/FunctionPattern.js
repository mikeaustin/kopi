const Function = require('./Function');

class FunctionPattern {
  constructor({ name, params }) {
    this.name = name;
    this.params = params;
  }

  matchValue(_expr, env, visitors) {
    return {
      [this.name]: new Function({ params: this.params, body: _expr, closure: env })
    };
  }

  matchType(_expr, context, visitors) {
    const type = visitors.visitNode(_expr, context);

    return {
      [this.name]: type
    };
  }
}

module.exports = FunctionPattern;
