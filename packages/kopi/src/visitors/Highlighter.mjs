import _Visitors from './Visitors.js';

const { default: Visitors } = _Visitors;

const indent = (level) => '\n' + ''.padEnd(level * 2);

class Highlighter extends Visitors {
  Block({ statements }, context) {
    const bind = (updates) => context = ({ ...context, ...updates });

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

  ApplyExpression({ expr, args }, level) {
    const evaluatedExpr = this.visitNode(expr, level + 1);
    const evaluatedArgs = this.visitNode(args, level + 1);

    return (
      indent(level) + '<span class="apply-expression">' +
      evaluatedExpr + evaluatedArgs +
      indent(level) + '</span>'
    );
  }

  FunctionExpression({ params, expr }, context) {
    const evaluatedParams = this.visitNode(params, context);

    return new FunctionType(evaluatedParams, new AnyType(), expr, context);
  }

  OperatorExpression({ op, left, right }, level) {
    return (
      indent(level) + '<span class="operator-expression">' +
      this.visitNode(left, level + 1) +
      indent(level + 1) + '<span class="operator">' + op + '</span>' +
      this.visitNode(right, level + 1) +
      indent(level) + '</span>'
    );
  }

  ParenthesesExpression({ expr }, level) {
    return (
      indent(level) + '<span class="parentheses-expression">' +
      this.visitNode(expr, level + 2) +
      indent(level) + '</span>'
    );
  }

  IdentifierPattern({ name }) {
    return new IdentifierPatternType(name);
  }

  BooleanLiteral({ value }) {
    if (typeof value !== 'boolean') {
      throw Error(`Value ${value} is not a boolean.`);
    }

    return new BooleanType();
  }

  NumericLiteral({ value }) {
    if (typeof value !== 'number') {
      throw Error('Value is not a number.');
    }

    return new NumberType();
  }

  StringLiteral({ value }) {
    if (typeof value !== 'string') {
      throw Error('Value is not a string.');
    }

    return new StringType();
  }

  Identifier({ name }, level) {
    return (
      indent(level) + '<span class="identifier">' + name + '</span>'
    );
  }
}

export default new Highlighter();
