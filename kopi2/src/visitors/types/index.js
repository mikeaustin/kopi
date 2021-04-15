const { AnyType } = require('./AnyType');
const { NoneType } = require('./NoneType');
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
  AnyType: new AnyType(),
  NoneType: new NoneType(),
  BooleanType: new BooleanType(),
  NumberType: new NumberType(),
  StringType: new StringType(),
  TupleType: (...types) => new TupleType(...types),
  ArrayType: (type) => new ArrayType(type),
  RangeType: (type) => new RangeType(type),
  FunctionType: (params, rettype) => new FunctionType(params, rettype),
  UnionType: (...types) => new UnionType(...types),
};
