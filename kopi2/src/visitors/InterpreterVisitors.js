const { default: BaseVisitors } = require('./BaseVisitor');
const { RuntimeError } = require('../errors');
const { AstNode, IdentifierPattern, AstIdentifierNode, AstNodeIdentifierPattern, Tuple, Range, Function } = require('./classes');
const { default: TypecheckVisitors } = require('./TypecheckVisitors');

class InterpreterVisitors extends BaseVisitors {
  AstNode({ _expr }) {
    return new AstNode(_expr);
  }

  Assignment({ _pattern, _expr }, scope, bind) {
    const evaluatedPattern = this.visitNode(_pattern, scope);
    const value = this.visitNode(_expr, scope);

    const matches = evaluatedPattern.matchValue(value, scope);

    bind(matches);
  }

  PipeExpression({ _left, _right }, scope) {
    const left = this.visitNode(_left, scope);

    if (_right._args) {
      const args = this.visitNode(_right._args, scope);

      return scope._methods.get(left.constructor)[_right._expr.name].apply.apply(left, [args, scope, this]);
    }

    return scope._methods.get(left.constructor)[_right.name].apply.apply(left);
  }

  ApplyExpression({ _expr, _args }, scope) {
    const value = this.visitNode(_expr, scope);
    const args = this.visitNode(_args, scope);

    return value.apply(args, scope, this);
  }

  TupleExpression({ _elements, _fields, type }, scope) {
    const tuple = new Tuple(_elements.map(element => this.visitNode(element, scope)), _fields.map(field => field?.name));
    tuple.type = type;

    return tuple;
  }

  FunctionExpression({ _params, _body, type }, scope) {
    const evaluatedParams = this.visitNode(_params, scope);

    const func = new Function(evaluatedParams, type?.rettype, _body, scope);
    func.type = type;

    return func;
  }

  RangeExpression({ from, to, type }, scope) {
    const range = new Range(this.visitNode(from, scope), this.visitNode(to, scope));
    range.type = type;

    return range;
  }

  OperatorExpression({ left, op, right }, scope) {
    const evaluatedLeft = this.visitNode(left, scope);
    const evaluatedRight = this.visitNode(right, scope);

    if (typeof evaluatedLeft === 'number' && typeof evaluatedRight === 'number') {
      switch (op) {
        case '+': return evaluatedLeft + evaluatedRight;
        case '-': return evaluatedLeft - evaluatedRight;
        case '*': return evaluatedLeft * evaluatedRight;
        case '/': return evaluatedLeft / evaluatedRight;
      }
    }
  }

  // TODO: Add ArrayFieldExpression and return Union type | ()
  FieldExpression({ expr, field }, scope) {
    return this.visitNode(expr, scope).valueForField(field.name || field.value);
  }

  IdentifierPattern({ _name }) {
    return new IdentifierPattern(_name);
  }

  AstNodeIdentifierPattern({ _expr }) {
    return new AstNodeIdentifierPattern(_expr);
  }

  NumericLiteral({ value }) {
    return value;
  }

  StringLiteral({ value }) {
    return value;
  }

  ArrayLiteral({ elements, type }, scope) {
    const array = elements.map(element => this.visitNode(element, scope));
    array.type = type;

    return array;
  }

  Identifier({ name }, scope) {
    return scope[name];
  }
}

module.exports = {
  default: InterpreterVisitors
};
