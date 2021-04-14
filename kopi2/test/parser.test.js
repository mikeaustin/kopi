const util = require("util");
const parser = require("../lib/parser");
const { Function, Tuple, IdentifierPattern } = require('../src/visitors/classes');
const { default: TypecheckVisitors } = require('../src/visitors/TypecheckVisitors');
const { default: initialContext } = require('../bin/context');

const {
  NoneType,
  BooleanType,
  NumberType,
  StringType,
  FunctionType,
  TupleType,
  ArrayType,
  RangeType,
  UnionType
} = require('../src/visitors/types');

let context = initialContext;

const visitors = new TypecheckVisitors();
const bind = types => context = { ...context, ...types };
const check = (line, context) => visitors.visitNode(parser.parse(line), context, bind);

test('Array', () => {
  expect(check('[(), (1, 2)]', context)).toEqual(
    ArrayType(
      UnionType(
        TupleType(),
        TupleType(NumberType, NumberType),
      )
    )
  );
  // expect(check('[(1, "x"), (1..5, "a".."z"), ()]', context)).toEqual(
  //   ArrayType(
  //     UnionType(
  //       TupleType(NumberType, StringType),
  //       TupleType(RangeType(NumberType), RangeType(StringType)),
  //       TupleType(),
  //     )
  //   )
  // );
});
