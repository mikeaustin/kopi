const { AnyType, NoneType, BooleanType, NumberType, FunctionType } = require('../src/types');
const { IdentifierPattern } = require('../src/parser/classes');

let context = {
  true: BooleanType(),
  even: FunctionType({
    params: new IdentifierPattern({
      name: 'n',
      type: NumberType()
    }),
    rettype: BooleanType()
  })
};

module.exports = context;
