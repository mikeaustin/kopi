const BaseVisitors = require('./BaseVisitors');
const { Function } = require('../classes');
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

    console.log('>>', func);
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

  FunctionPattern({ name, params, constructor, ...props }) {
    return new constructor({
      ...props,
      name: name,
      params: params,
      type: undefined,
      matchType: function (_expr, context, visitors) {
        const type = visitors.visitNode(_expr, context);

        return {
          [this.name]: new Function({ params: params, body: _expr, closure: context })
        };
      }
    });
  }

  IdentifierPattern({ name, constructor, ...props }, context) {
    return new constructor({
      ...props,
      name: name,
      type: undefined,
      matchType: function (_expr, context, visitors) {
        const type = visitors.visitNode(_expr, context);

        return {
          [this.name]: type
        };
      }
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
