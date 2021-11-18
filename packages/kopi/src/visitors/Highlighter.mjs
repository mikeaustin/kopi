import _Visitors from './Visitors.js';

const { default: Visitors } = _Visitors;

const indent = (level) => '\n' + ''.padEnd(level * 2);

class Highlighter extends Visitors {
  Block({ statements }, level) {
    return (
      indent(level) + '<block>' +
      statements.map((statement) => (
        indent(level + 1) + '<statement>' +
        this.visitNode(statement, level + 2) +
        indent(level + 1) + '</statement>'
      )).join('') +
      indent(level) + '</block>'
    );
  }

  Assignment({ pattern, expr }, level) {
    return (
      indent(level) + '<assignment-statement>' +
      this.visitNode(pattern, level + 1) +
      indent(level + 1) + '<assignment>=</assignment>' +
      this.visitNode(expr, level + 1) +
      indent(level) + '</assignment-statement>'
    );
  }

  PipeExpression({ left, right }, level) {
    return (
      indent(level) + '<pipe-expression>' +
      this.visitNode(left, level + 1) +
      indent(level + 1) + '<pipe>|</pipe>' +
      this.visitNode(right, level + 1) +
      indent(level) + '</pipe-expression>'
    );
  }

  ApplyExpression({ expr, args }, level) {
    const evaluatedExpr = this.visitNode(expr, level + 1);
    const evaluatedArgs = this.visitNode(args, level + 1);

    return (
      indent(level) + '<apply-expression>' +
      evaluatedExpr + evaluatedArgs +
      indent(level) + '</apply-expression>'
    );
  }

  xFunctionExpression({ params, expr }, level) {
    return (
      this.visitNode(params, level) +
      indent(level + 1) + '=>' +
      this.visitNode(expr, level)
    );
  }

  FunctionExpression({ params, expr }, level) {
    return (
      indent(level) + '<function-expression>' +
      this.visitNode(params, level) +
      indent(level) + '<arrow class="symbol">=></arrow>' +
      this.visitNode(expr, level)
    );
  }

  OperatorExpression({ op, left, right }, level) {
    return (
      indent(level) + '<operator-expression>' +
      this.visitNode(left, level + 1) +
      indent(level + 1) + '<operator>' + op + '</operator>' +
      this.visitNode(right, level + 1) +
      indent(level) + '</operator-expression>'
    );
  }

  ParenthesesExpression({ expr }, level) {
    return (
      indent(level) + '<parentheses-expression>' +
      this.visitNode(expr, level + 1) +
      indent(level) + '</parentheses-expression>'
    );
  }

  IdentifierPattern({ name }, level) {
    return (
      indent(level) + '<identifier-pattern class="pattern">' + name + '</identifier-pattern>'
    );
  }

  BooleanLiteral({ value }) {
    if (typeof value !== 'boolean') {
      throw Error(`Value ${value} is not a boolean.`);
    }

    return new BooleanType();
  }

  NumericLiteral({ value }, level) {
    return indent(level) + '<numeric-literal>' + String(value) + '</numeric-literal>';
  }

  StringLiteral({ value }) {
    if (typeof value !== 'string') {
      throw Error('Value is not a string.');
    }

    return new StringType();
  }

  Identifier({ name }, level) {
    return (
      indent(level) + '<identifier>' + name + '</identifier>'
    );
  }
}

export default new Highlighter();
