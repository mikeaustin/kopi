const BaseVisitors = require('./BaseVisitors');

class InterpreterVisitors extends BaseVisitors {
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
