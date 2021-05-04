const BaseVisitors = require('./BaseVisitors');
const { IdentifierPattern } = require('../classes');

class InterpreterVisitors extends BaseVisitors {
  Assignment({ pattern: _pattern, expr: _expr }, env, bind) {
    const pattern = this.visitNode(_pattern, env);

    const matches = pattern.matchValue(_expr, env, this);

    bind(matches);
  }

  IdentifierPattern({ name }) {
    return new IdentifierPattern({ name });
  }

  NumericLiteral({ value }) {
    return value;
  }

  StringLiteral({ value }) {
    return value;
  }

  Identifier({ name }, env) {
    return env[name];
  }
};

module.exports = new InterpreterVisitors();
