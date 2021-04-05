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

  FunctionExpression({ params, body }, scope) {
    return new Function(params, body, scope);
  }

  ApplyExpression({ expr, args }, scope) {
    const type = this.visitNode(expr, scope);
    const arg = this.visitNode(args, scope);

    const matches = type.params?.matchType(arg);

    if (!type.params) {
      throw new TypeError(`Function application not defined for type '${type.name}'`);
    }

    if (!matches) {
      throw new TypeError(`Argument to function ${expr?.name} should be of type '${type.params.type?.name}', but found '${arg?.name}'`);
    }

    if (type.body) {
      return this.visitNode(type.body, { ...type.closure, ...matches });
    }

    return type.type;
  }

  TupleExpression({ elements }, scope) {
    return elements.map(element => this.visitNode(element, scope));
  }

  //

  IdentifierPattern({ name }, context) {
    return this.type;
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
