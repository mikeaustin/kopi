const BaseVisitors = require('./BaseVisitors');
const { IdentifierPattern, FunctionPattern } = require('../classes');

class TypecheckVisitors extends BaseVisitors {
  Assignment({ pattern: _pattern, expr: _expr }, context, bind) {
    const pattern = this.visitNode(_pattern, context);

    console.log(pattern);
    const matches = pattern.matchType(_expr, context, this);

    bind(matches);
  }

  ApplyExpression({ expr: _expr, args: _args }, env, bind) {
  }

  FunctionPattern({ name, params }) {
    return new FunctionPattern({
      name: name,
      params: params,
      type: undefined
    });
  }

  IdentifierPattern({ name }, context) {
    return new IdentifierPattern({
      name: name,
      type: undefined
    });
  }

  NumericLiteral(astNode) {
    const { value } = astNode;

    return new astNode.constructor({
      value: value,
      type: Number,
    });
  }

  StringLiteral(astNode) {
    const { value } = astNode;

    return new astNode.constructor({
      value: value,
      type: String,
    });
  }

  Identifier({ name }, context) {
    return context[name];
  }
};

module.exports = new TypecheckVisitors();
