import _Visitors from './Visitors.js';

const { default: Visitors } = _Visitors;

// const indent = (level) => '\n' + ''.padEnd(level * 2);
const indent = (level) => '';
const spaces = (level) => ''.padEnd(level * 2 * 6, '&nbsp;');

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
      indent(level + 1) + '<assignment> = </assignment>' +
      this.visitNode(expr, level + 1) +
      indent(level) + '</assignment-statement>'
    );
  }

  PipeExpression({ left, right }, level) {
    return (
      indent(level) + '<pipe-expression>' +
      this.visitNode(left, level + 1) +
      indent(level + 1) + '<pipe> | </pipe>' +
      this.visitNode(right, level + 1) +
      indent(level) + '</pipe-expression>'
    );
  }

  ApplyExpression({ expr, args }, level) {
    const evaluatedExpr = this.visitNode(expr, level + 1);
    const evaluatedArgs = this.visitNode(args, level + 1);

    return (
      indent(level) + '<apply-expression>' +
      evaluatedExpr + ' ' + evaluatedArgs +
      indent(level) + '</apply-expression>'
    );
  }

  TupleExpression({ elements, fields, multiline }, level) {
    if (elements.length === 0) {
      return '()';
    }

    return (
      (multiline ? '<br />' : '') +
      elements.map((element, index) => (
        indent(level) + (multiline ? spaces(1) : '') + (fields[index] ? '<field-name>' + fields[index] + '</field-name>' : '') +
        indent(level) + (fields[index] ? '<colon>: </colon>' : '') + this.visitNode(element, level)
      )).join(indent(level) + (multiline ? '<br />' : '<comma>, </comma>')) +
      (multiline ? '<br />' : '')
    );
  }

  FunctionExpression({ params, expr }, level) {
    return (
      indent(level) + '<function-expression>' +
      this.visitNode(params, level + 1) +
      indent(level + 1) + '<arrow class="symbol"> => </arrow>' +
      this.visitNode(expr, level + 1) +
      indent(level) + '</function-expression>'
    );
  }

  OperatorExpression({ op, left, right }, level) {
    return (
      indent(level) + '<operator-expression>' +
      this.visitNode(left, level + 1) +
      indent(level + 1) + '<operator> ' + op + ' </operator>' +
      this.visitNode(right, level + 1) +
      indent(level) + '</operator-expression>'
    );
  }

  ParenthesesExpression({ expr, multiline }, level) {
    return (
      indent(level) + '<parentheses-expression>' + (multiline ? '<br />' : '') +
      this.visitNode(expr, level + 1) + (multiline ? '<br />' : '') +
      indent(level) + '</parentheses-expression>'
    );
  }

  TuplePattern({ elements }, level) {
    if (elements.length === 0) {
      return '()';
    }

    return elements.map((element) => (
      this.visitNode(element, level)
    )).join('<comma>, </comma>');
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
