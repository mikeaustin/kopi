import _Visitors from './Visitors.js';

const { default: Visitors } = _Visitors;

// const indent = (level) => '\n' + ''.padEnd(level * 2);
const indent = (level) => '';
const spaces = (level) => ''.padEnd(level * 2 * 6, '&nbsp;');

class PrettyPrinter extends Visitors {
  Assignment({ pattern, expr }, level) {
    return (
      this.visitNode(pattern, level + 1) + ' = ' + this.visitNode(expr, level + 1)
    );
  }

  //

  PipeExpression({ left, right }) {
    return `${this.visitNode(left)} | ${this.visitNode(right)}`;
  }

  TupleExpression({ fields, fieldNames }, level) {
    if (fields.length === 0) {
      return '()';
    }

    return (
      fields.map((element, index) => (
        (fieldNames[index] ? fieldNames[index] : '') +
        (fieldNames[index] ? ': ' : '') + this.visitNode(element, level)
      )).join(indent(', '))
    );
  }

  ArrayExpression({ elements }, level) {
    return (
      '[' +
      elements.map((element) => (
        this.visitNode(element, level)
      )).join(indent(', ')) +
      ']'
    );
  }

  ApplyExpression({ expr, args }, level) {
    const evaluatedExpr = this.visitNode(expr, level + 1);
    const evaluatedArgs = this.visitNode(args, level + 1);

    return (
      evaluatedExpr + ' ' + evaluatedArgs
    );
  }

  OperatorExpression({ op, left, right }, level) {
    return (
      this.visitNode(left, level + 1) + ' ' + op + ' ' + this.visitNode(right, level + 1)
    );
  }

  FunctionExpression({ params, expr }, level) {
    return (
      this.visitNode(params, level + 1) + ' => ' + this.visitNode(expr, level + 1)
    );
  }

  ParenthesesExpression({ expr }) {
    return `(${this.visitNode(expr)})`;
  }

  //

  TuplePattern({ fields }, level) {
    if (fields.length === 0) {
      return '()';
    }

    return fields.map((element) => this.visitNode(element, level)).join(', ');
  }

  NumericLiteralPattern({ value }) {
    return String(value);
  }

  StringLiteralPattern({ value }) {
    return value;
  }

  IdentifierPattern({ name }, level) {
    return (
      name
    );
  }

  //

  NumericLiteral({ value }, level) {
    return String(value);
  }

  StringLiteral({ value }, level) {
    return value;
  }

  Identifier({ name }, level) {
    return (
      name
    );
  }
}

export default new PrettyPrinter();
