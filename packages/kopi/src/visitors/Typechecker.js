const { default: Visitors } = require('./Visitors');

const { UnionType, NumberType, StringType, FunctionType, IdentifierPatternType, AnyType } = require('../types');

class Typechecker extends Visitors {
  Block({ statements }, context) {
    const bind = updates => context = ({ ...context, ...updates });

    return statements.reduce((result, statement) => (
      this.visitNode(statement, context, bind)
    ), undefined);
  }

  Assignment({ pattern, expr }, context, bind) {
    const evaluatedPattern = this.visitNode(pattern, context);
    const evaluatedExpr = this.visitNode(expr, context);

    // console.log('Assignment', { evaluatedPattern, evaluatedExpr });

    const matches = evaluatedPattern.getTypeMatches(evaluatedExpr, context);

    bind(matches);
  }

  ApplyExpression({ expr, args }, context) {
    const evaluatedExpr = this.visitNode(expr, context);
    const evaluatedArgs = this.visitNode(args, context);

    if (!evaluatedExpr.params) {
      throw new TypeError(`Function application not defined for type '${evaluatedExpr.name}'.`);
    }

    const matches = evaluatedExpr.params.getTypeMatches(evaluatedArgs);

    if (!matches) {
      throw new TypeError(`Argument to function '${evaluatedExpr?.name}' should be type '${evaluatedExpr.params.type?.name}', but found '${evaluatedArgs.name}'.`);
    }

    if (evaluatedExpr.expr) {
      return this.visitNode(evaluatedExpr.expr, { ...evaluatedExpr.context, ...matches });
    }

    return evaluatedExpr.rettype;
  }

  FunctionExpression({ params, expr }, context) {
    const evaluatedParams = this.visitNode(params, context);

    return new FunctionType(evaluatedParams, new AnyType(), expr, context);
  }

  IdentifierPattern({ name }) {
    return new IdentifierPatternType(name);
  }

  NumericLiteral({ value }) {
    if (typeof value !== 'number') {
      throw Error(`Value is not a number.`);
    }

    return new NumberType();
  }

  StringLiteral({ value }) {
    if (typeof value !== 'string') {
      throw Error(`Value is not a string.`);
    }

    return new StringType();
  }

  Identifier({ name }, context) {
    if (!context[name]) {
      throw new TypeError(`Variable '${name}' is not defined in the current scope.`);
    }

    return context[name];
  }
}

module.exports = {
  default: new Typechecker(),
};
