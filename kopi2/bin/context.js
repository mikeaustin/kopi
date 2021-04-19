const {
  AnyType,
  NoneType,
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

Object.defineProperty(Number.prototype, '0', {
  get: function () {
    return this;
  }
});

Array.prototype.valueForField = function (field) {
  if (typeof field === 'number') {
    return this[field] ?? TupleType();
  }
};

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
  help: FunctionType(new IdentifierPattern('func', AnyType), TupleType()),
  source: FunctionType(new IdentifierPattern('func', AnyType), TupleType()),
  type: FunctionType(new IdentifierPattern('value', AnyType), AnyType),
  inspect: FunctionType(new IdentifierPattern('value', AnyType), StringType),
  not: FunctionType(new IdentifierPattern('value', BooleanType), BooleanType),
  even: FunctionType(new IdentifierPattern('value', NumberType), BooleanType),
  union: FunctionType(new IdentifierPattern('value', UnionType(NumberType, StringType)), BooleanType),
  print: FunctionType(new IdentifierPattern('value', AnyType), TupleType()),
  test: FunctionType(new IdentifierPattern('value', ArrayType(NumberType)), TupleType()),
  _: NoneType
};

module.exports = {
  default: context
};
