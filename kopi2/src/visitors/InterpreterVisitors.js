const { default: BaseVisitors } = require('./BaseVisitor');
const { RuntimeError } = require('../errors');
const { AnyType, NoneType, BooleanType, NumberType, StringType, TupleType, FunctionType, RangeType, UnionType, ArrayType } = require('./types');
const { AstNode, IdentifierPattern, AstNodeIdentifierPattern, Tuple, Range, Function } = require('./classes');
const { default: TypeCheckVisitors } = require('./TypeCheckVisitors');

const typeCheckVisitors = new TypeCheckVisitors();

class InterpreterVisitors extends BaseVisitors {
  AstNode({ _expr }) {
    return new AstNode(_expr);
  }

  AstIdentifierNode({ _expr }) {
    return new AstIdentifierNode(_expr);
  }

  Assignment({ _pattern, _expr }, scope, bind) {
    const evaluatedPattern = this.visitNode(_pattern, scope);
    const value = this.visitNode(_expr, scope);

    const matches = evaluatedPattern.matchValue(value, scope);

    bind(matches);
  }

  ApplyExpression({ _expr, _args }, scope) {
    const value = this.visitNode(_expr, scope);
    const args = this.visitNode(_args, scope);

    return value.apply(args, scope, this);
  }

  TupleExpression({ _elements }, scope) {
    return new Tuple(..._elements.map(element => this.visitNode(element, scope)));
  }

  FunctionExpression({ _params, _body }, scope) {
    const evaluatedParams = this.visitNode(_params, scope);
    evaluatedParams.type = NoneType;

    return new Function(evaluatedParams, NoneType, _body, scope);
  }

  RangeExpression({ from, to }, scope) {
    const range = new Range(this.visitNode(from, scope), this.visitNode(to, scope));
    range.type = typeCheckVisitors.RangeExpression({ from, to });

    return range;
  }

  FieldExpression({ expr, field }, scope) {
    return this.visitNode(expr, scope)[field.name || field.value];
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

  ArrayLiteral({ elements }, scope) {
    const array = elements.map(element => this.visitNode(element, scope));

    array.type = typeCheckVisitors.ArrayLiteral({ elements });

    return array;
  }

  Identifier({ name }, scope) {
    return scope[name];
  }
}

module.exports = {
  default: InterpreterVisitors
};
