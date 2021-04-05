const { default: BaseVisitors } = require('./BaseVisitor');
const { InterpreterError } = require('../errors');
const { Tuple, Function } = require('./classes');

class TypecheckVisitors extends BaseVisitors {
  Assignment({ pattern, expr }, context, bind) {
    if (!pattern.matchValue) {
      throw new InterpreterError(`No matchValue method defined for pattern '${pattern.constructor.name}'`);
    }

    const type = this.visitNode(expr, context);

    const matches = pattern.matchType(type, context);

    bind(matches);
  }

  FunctionExpression({ params, body }) {
    return Function;
  }

  ApplyExpression({ expr, args }, scope) {
    const type = this.visitNode(expr, scope);

    if (!type.prototype.apply) {
      throw new TypeError(`Function application not defined for type '${type.name}'`);
    }
  }

  TupleExpression({ elements }, scope) {
    return elements.map(element => this.visitNode(element, scope));
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
