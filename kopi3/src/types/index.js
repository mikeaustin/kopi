const AnyType = require('./AnyType');
const NoneType = require('./NoneType');
const BooleanType = require('./BooleanType');
const NumberType = require('./NumberType');
const FunctionType = require('./FunctionType');

module.exports = {
  AnyType: () => new AnyType(),
  NoneType: () => new NoneType(),
  BooleanType: () => new BooleanType(),
  NumberType: () => new NumberType(),
  FunctionType: (params) => new FunctionType(params),
};
