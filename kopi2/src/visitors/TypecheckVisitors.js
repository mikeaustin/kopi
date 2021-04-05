const { default: BaseVisitors } = require('./BaseVisitor');
const { InterpreterError } = require('../errors');
const { IdentifierPattern, Tuple, Function } = require('./classes');

class TypecheckVisitors extends BaseVisitors {
  Assignment({ pattern, expr }, context, bind) {
    if (!pattern.matchValue) {
      throw new InterpreterError(`No matchValue method defined for pattern '${pattern.constructor.name}'`);
    }

    const type = this.visitNode(expr, context);

    const matches = pattern.matchType(type, context);

    bind(matches);
  }

  FunctionExpression({ params, body }, context) {
    const evaluatedParams = this.visitNode(params, context);

    return new Function(evaluatedParams, body, context);
  }

  ApplyExpression({ expr, args }, context) {
    const type = this.visitNode(expr, context);
    const arg = this.visitNode(args, context);

    if (!type.params) {
      throw new TypeError(`Function application not defined for type '${type.name}.'`);
    }

    const matches = type.params.matchType(arg);

    if (!matches) {
      throw new TypeError(`Argument to function '${expr?.name}' should be type '${type.params.type?.name}', but found '${arg.name}'.`);
    }

    if (type.body) {
      return this.visitNode(type.body, { ...type.closure, ...matches });
    }

    return type.type;
  }

  TupleExpression({ elements }, context) {
    return new Tuple(elements.map(element => this.visitNode(element, context)));
  }

  //

  IdentifierPattern({ name, type }, context) {
    return new IdentifierPattern(name, type);
  }

  //

  NumericLiteral({ value }) {
    if (typeof value !== 'number') {
      throw TypeError(`Value is not a number.`);
    }

    return Number;
  }

  StringLiteral({ value }) {
    if (typeof value !== 'string') {
      throw TypeError(`Value is not a string.`);
    }

    return String;
  }

  Identifier({ name }, context) {
    if (!context[name]) {
      throw new Error(`Variable '${name}' is not defined the current scope.`);
    }

    return context[name];
  }
}

module.exports = {
  default: TypecheckVisitors
};
