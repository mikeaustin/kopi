const { default: BaseVisitors } = require('./BaseVisitor');
const { InterpreterError } = require('../errors');
const { AnyType, BooleanType, NumberType, StringType, TupleType, FunctionType, UnionType } = require('./types');
const { IdentifierPattern, AstNode, AstNodeIdentifierPattern, Tuple, Function } = require('./classes');

class TypecheckVisitors extends BaseVisitors {
  AstNode({ _expr }) {
    return _expr;
  }

  Assignment({ _pattern, _expr }, context, bind) {
    const pattern = this.visitNode(_pattern, context);
    const type = this.visitNode(_expr, context);

    if (!pattern.matchValue) {
      throw new InterpreterError(`No matchValue method defined for pattern '${_pattern.constructor.name}'`);
    }

    const matches = pattern.matchType(type, context);

    bind(matches);
  }

  FunctionExpression({ _params, _body }, context) {
    const params = this.visitNode(_params, context);

    return new Function(params, undefined, _body, context);
  }

  ApplyExpression({ _expr, _args }, context) {
    const type = this.visitNode(_expr, context);
    const args = this.visitNode(_args, context);

    if (!type.params) {
      throw new TypeError(`Function application not defined for type '${type.name}.'`);
    }

    const matches = type.params.matchType(args);

    if (!matches) {
      throw new TypeError(`Argument to function '${_expr?.name}' should be type '${type.params.type?.name}', but found '${args.name}'.`);
    }

    if (type.body) {
      return this.visitNode(type.body, { ...type.closure, ...matches });
    }

    return type.rettype;
  }

  TupleExpression({ _elements }, context) {
    return TupleType(..._elements.map(element => this.visitNode(element, context)));
  }

  FieldExpression({ expr, field }) {

  }

  //

  IdentifierPattern({ _name, type }, context) {
    return new IdentifierPattern(_name, type);
  }

  AstNodeIdentifierPattern({ _expr }) {
    return new AstNodeIdentifierPattern(_expr);
  }

  //

  NumericLiteral({ value }) {
    if (typeof value !== 'number') {
      throw TypeError(`Value is not a number.`);
    }

    return NumberType;
  }

  StringLiteral({ value }) {
    if (typeof value !== 'string') {
      throw TypeError(`Value is not a string.`);
    }

    return StringType;
  }

  Identifier({ name }, context) {
    if (!context[name]) {
      throw new Error(`Variable '${name}' is not defined the current scope.`);
    }

    return context[name];
  }
}

module.exports = {
  default: TypecheckVisitors
};
