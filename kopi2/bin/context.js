const {
  AnyType,
  VoidType,
  BooleanType,
  NumberType,
  StringType,
  TupleType,
  FunctionType,
  UnionType,
  ArrayType,
} = require('../src/visitors/types');
const { Function, Tuple, IdentifierPattern } = require('../src/visitors/classes');

Boolean.prototype.type = BooleanType;
Number.prototype.type = NumberType;
String.prototype.type = StringType;

Boolean.prototype.escape = function () {
  return `${this}`;
};

Number.prototype.escape = function () {
  return `${this}`;
};

String.prototype.escape = function () {
  return `"${this}"`;
};

Array.prototype.escape = function () {
  return `[${this.map(element => element.escape()).join(', ')}]`;
};

let context = {
  true: BooleanType,
  false: BooleanType,
  env: FunctionType(VoidType, VoidType),
  help: FunctionType(new IdentifierPattern('func', AnyType), VoidType),
  source: FunctionType(new IdentifierPattern('func', AnyType), VoidType),
  type: FunctionType(new IdentifierPattern('value', AnyType), AnyType),
  inspect: FunctionType(new IdentifierPattern('value', AnyType), StringType),
  not: FunctionType(new IdentifierPattern('value', BooleanType), BooleanType),
  even: FunctionType(new IdentifierPattern('value', NumberType), BooleanType),
  union: FunctionType(new IdentifierPattern('value', UnionType(NumberType, StringType)), BooleanType),
  print: FunctionType(new IdentifierPattern('value', AnyType), VoidType),
  test: FunctionType(new IdentifierPattern('value', ArrayType(NumberType)), VoidType),
};

module.exports = {
  default: context
};
