const { default: BaseVisitors } = require('./BaseVisitor');
const { InterpreterError } = require('../errors');
const { AnyType, NoneType, BooleanType, NumberType, StringType, TupleType, FunctionType, RangeType, UnionType, ArrayType } = require('./types');
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

  PipeExpression(astNode, context) {
    const { _left, _right } = astNode;

    const type = this.visitNode(_left, context);
    // const args = this.visitNode(_right, context);
  }

  FunctionExpression(astNode, context) {
    const { _params, _body } = astNode;

    const params = this.visitNode(_params, context);
    // TODO: Find rettype of body
    // const body = this.visitNode(_body, { x: params.type, ...context });

    return astNode.type = FunctionType(params, undefined, _body, context);
  }

  ApplyExpression(astNode, context) {
    const { _expr, _args } = astNode;

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
      return this.visitNode(type.body, { ...type.context, ...matches });
    }

    return astNode.type = type.rettype;
  }

  TupleExpression(astNode, context) {
    const { _elements } = astNode;

    return astNode.type = TupleType(..._elements.map(element => this.visitNode(element, context)));
  }

  RangeExpression(astNode, context) {
    const { from, to } = astNode;

    if (!this.visitNode(from, context).includesType(this.visitNode(to, context))) {
      throw new TypeError(`Range types must be equal`);
    }

    return astNode.type = RangeType(this.visitNode(from, context), this.visitNode(to, context));
  }

  OperatorExpression(astNode, context) {
    const { left, op, right } = astNode;

    const evaluatedLeft = this.visitNode(left, context);
    const evaluatedRight = this.visitNode(right, context);
    console.log(evaluatedRight);

    if (evaluatedLeft.includesType(NumberType)) {
      if (!evaluatedRight.includesType(NumberType)) {
        throw new TypeError(`Argument to operator 'Number.${op}' should be type 'Number', but found '${evaluatedRight.name}'`);
      }
    }

    return evaluatedRight;
  }

  FieldExpression(astNode, context) {
    const { expr, field } = astNode;

    const evaluatedExpr = this.visitNode(expr, context);

    const type = evaluatedExpr.typeForField(field);

    if (!type) {
      throw new TypeError(`Tuple index ${field.value} is out of bounds`);
    }

    return astNode.type = type;
  }

  //

  IdentifierPattern({ _name }, context) {
    // TODO: Add generic type variable
    return new IdentifierPattern(_name, undefined);
  }

  AstNodeIdentifierPattern({ _expr }) {
    return new AstNodeIdentifierPattern(_expr);
  }

  //

  NumericLiteral(astNode) {
    const { value } = astNode;

    if (typeof value !== 'number') {
      throw TypeError(`Value is not a number.`);
    }

    return astNode.type = NumberType;
  }

  StringLiteral(astNode) {
    const { value } = astNode;

    if (typeof value !== 'string') {
      throw TypeError(`Value is not a string.`);
    }

    return astNode.type = StringType;
  }

  ArrayLiteral(astNode, context) {
    const { elements } = astNode;

    // console.error('> ArrayLiteral', { elements });

    if (elements.length === 0) {
      return astNode.type = ArrayType(NoneType);
    }

    const valueTypes = elements.map(element => this.visitNode(element, context));

    const valueTypesSet = valueTypes.filter(
      (valueType, index) => index === valueTypes.findIndex((t) => t.includesType(valueType))
    );

    if (valueTypesSet.every(valueType => valueType.elementType === NoneType)) {
      return astNode.type = ArrayType(valueTypesSet[0]);
    }

    const filteredValueTypesSet = valueTypesSet.filter(valueType => valueType.elementType !== NoneType);

    if (filteredValueTypesSet.length === 1) {
      return astNode.type = ArrayType(filteredValueTypesSet[0]);
    }

    return astNode.type = ArrayType(UnionType(...filteredValueTypesSet));
  }

  Identifier(astNode, context) {
    // console.error('Identifier', name, context);

    const { name } = astNode;

    if (!context[name]) {
      throw new Error(`Variable '${name}' is not defined the current scope.`);
    }

    return astNode.type = context[name];
  }
}

module.exports = {
  default: TypecheckVisitors
};
