const { default: BaseVisitors } = require('./BaseVisitor');

class BaseError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
  }
}

class InterpreterError extends BaseError { }
class RuntimeError extends BaseError { }


class TypecheckVisitors extends BaseVisitors {
  Assignment({ left, right }, context, bind) {
    if (!left.matchValue) {
      throw new InterpreterError(`No matchValue method defined for pattern '${left.constructor.name}'`);
    }

    const type = this.visitNode(right, context);

    const matches = left.matchType(type, context);

    bind(matches);
  }

  FunctionExpression({ params, body }) {

  }

  ApplyExpression({ expr, args }) {

  }

  //

  IdentifierPattern({ name }, context) {
    console.log('here', name);
  }

  //

  NumericLiteral({ value }) {
    if (typeof value !== 'number') {
      throw TypeError('Value is not a number');
    }

    return Number;
  }

  StringLiteral({ value }) {
    return String;
  }

  Identifier({ name }, context) {
    if (!context[name]) {
      throw new Error(`Variable '${name}' is not defined.`);
    }

    return context[name];
  }
}

module.exports = {
  default: TypecheckVisitors
};
