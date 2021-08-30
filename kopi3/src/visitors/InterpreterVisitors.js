const BaseVisitors = require('./BaseVisitors');
const { Function } = require('../classes');

class InterpreterVisitors extends BaseVisitors {
  Assignment({ pattern: _pattern, expr: _expr }, env, bind) {
    const pattern = this.visitNode(_pattern, env);
    console.log(pattern);
    const matches = pattern.matchValue(_expr, env, this);

    bind(matches);
  }

  ApplyExpression({ expr: _expr, args: _args }, env, bind) {
    const func = this.visitNode(_expr, env);
    // const args = this.visitNode(_args, env);

    return func.apply(null, [_args, env, this]);
  }

  FunctionPattern({ name, params, constructor, ...props }) {
    return new constructor({
      ...props,
      name,
      params,
      matchValue: function (_expr, env, visitors) {
        return {
          [this.name]: new Function({ params: this.params, body: _expr, closure: env })
        };
      }
    });
  }

  IdentifierPattern({ name, constructor, ...props }) {
    return new constructor({
      ...props,
      name,
      matchValue: function (_expr, env, visitors) {
        const value = visitors.visitNode(_expr, env);

        return {
          [this.name]: value
        };
      },
    });
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
