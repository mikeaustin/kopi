const { AnyType } = require('./AnyType');
const { NoneType } = require('./NoneType');
const { AstNodeType } = require('./AstNodeType');
const { BooleanType } = require('./BooleanType');
const { NumberType } = require('./NumberType');
const { StringType } = require('./StringType');
const { TupleType } = require('./TupleType');
const { ArrayType } = require('./ArrayType');
const { RangeType } = require('./RangeType');
const { FunctionType } = require('./FunctionType');
const { UnionType } = require('./UnionType');

/*

interface FieldAccess {
  typeForField(field: Number | String): Type
}

*/

module.exports = {
  AnyType: () => new AnyType(),
  NoneType: () => new NoneType(),
  AstNodeType: () => new AstNodeType(),
  BooleanType: () => new BooleanType(),
  NumberType: () => new NumberType(),
  StringType: () => new StringType(),
  TupleType: (types, fields) => new TupleType(types, fields),
  ArrayType: (type) => new ArrayType(type),
  RangeType: (type) => new RangeType(type),
  FunctionType: (params, rettype, body, context) => new FunctionType(params, rettype, body, context),
  UnionType: (...types) => new UnionType(...types),
};
