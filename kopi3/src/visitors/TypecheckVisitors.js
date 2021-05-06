const BaseVisitors = require('./BaseVisitors');
const { NumberType } = require('../types');

class TypecheckVisitors extends BaseVisitors {
  Assignment({ pattern: _pattern, expr: _expr }, context, bind) {
    const pattern = this.visitNode(_pattern, context);

    const matches = pattern.matchType(_expr, context, this);

    bind(matches);
  }

  ApplyExpression({ expr: _expr, args: _args, constructor }, context, bind) {
    const func = this.visitNode(_expr, context);
    const args = this.visitNode(_args, context);

    console.log('>>', func.type);
    const matches = func.type.params.matchType(_args, context, this);

    // if (func.body) {
    //   return this.visitNode(func.body, { ...type.context, ...matches });
    // }

    return new constructor({
      expr: _expr,
      args: _args,
      type: func.type.rettype,
    });
  }

  FunctionPattern({ name, params, constructor }) {
    return new constructor({
      name: name,
      params: params,
      type: undefined
    });
  }

  IdentifierPattern({ name, constructor }, context) {
    return new constructor({
      name: name,
      type: undefined,
    });
  }

  NumericLiteral({ value, constructor }) {
    return new constructor({
      value: value,
      type: NumberType(),
    });
  }

  StringLiteral({ value, constructor }) {
    return new constructor({
      value: value,
      type: String,
    });
  }

  Identifier({ name, constructor }, context) {
    return new constructor({
      name: name,
      type: context[name],
    });
  }
};

module.exports = new TypecheckVisitors();
