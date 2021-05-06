const BaseVisitors = require('./BaseVisitors');
const { IdentifierPattern, FunctionPattern } = require('../parser/classes');

class InterpreterVisitors extends BaseVisitors {
  Assignment({ pattern: _pattern, expr: _expr }, env, bind) {
    const pattern = this.visitNode(_pattern, env);

    const matches = pattern.matchValue(_expr, env, this);

    bind(matches);
  }

  ApplyExpression({ expr: _expr, args: _args }, env, bind) {
    const func = this.visitNode(_expr, env);
    // const args = this.visitNode(_args, env);

    return func.apply(null, [_args, env, this]);
  }

  FunctionPattern({ name, params }) {
    return new FunctionPattern({ name, params });
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
