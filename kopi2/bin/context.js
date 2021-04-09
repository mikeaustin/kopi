const {
  AnyType,
  Void,
  BooleanType,
  NumberType,
  StringType,
  TupleType,
  FunctionType,
  UnionType
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

let context = {
  true: BooleanType,
  false: BooleanType,
  env: FunctionType(Void, Void),
  help: FunctionType(new IdentifierPattern('func', AnyType), Void),
  source: FunctionType(new IdentifierPattern('func', AnyType), Void),
  type: FunctionType(new IdentifierPattern('value', AnyType), Void),
  inspect: FunctionType(new IdentifierPattern('value', AnyType), StringType),
  not: FunctionType(new IdentifierPattern('value', BooleanType), BooleanType),
  even: FunctionType(new IdentifierPattern('value', NumberType), BooleanType),
  union: FunctionType(new IdentifierPattern('value', UnionType(NumberType, StringType)), BooleanType),
  print: FunctionType(new IdentifierPattern('value', AnyType), Void),
};

module.exports = {
  default: context
};
