const util = require("util");
const parser = require("../lib/parser");
const { default: TypecheckVisitors } = require('../src/visitors/TypecheckVisitors');
const { default: initialContext } = require('../bin/context');
const { NoneType, VoidType, BooleanType, NumberType, StringType, TupleType, ArrayType, RangeType, UnionType } = require('../src/visitors/types');

let context = initialContext;

const visitors = new TypecheckVisitors();
const bind = types => context = { ...context, ...types };
const check = (line, context) => visitors.visitNode(parser.parse(line), context, bind);

test('Array', () => {
  // expect(() => check('[1, "x"]', context)).toThrow(TypeError);
  expect(check('[]', context)).toEqual(ArrayType(NoneType));
  expect(check('[[]]', context)).toEqual(ArrayType(ArrayType(NoneType)));
  expect(check('[[], []]', context)).toEqual(ArrayType(ArrayType(NoneType)));
  expect(check('[1, 1]', context)).toEqual(ArrayType(NumberType));
  expect(check('[1, "x"]', context)).toEqual(ArrayType(UnionType(NumberType, StringType)));
  expect(check('[[1], []]', context)).toEqual(ArrayType(ArrayType(NumberType)));
  expect(check('[[], [1]]', context)).toEqual(ArrayType(ArrayType(NumberType)));
  expect(check('[[], []]', context)).toEqual(ArrayType(ArrayType(NoneType)));
  expect(check('[[1], [1]]', context)).toEqual(ArrayType(ArrayType(NumberType)));
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

test('Argument', () => {
  expect(() => check('even "x"', context)).toThrow(TypeError);
});

test('Lambda', () => {
  expect(check('even 0', context)).toEqual(BooleanType);
  expect(check('not (even 0)', context)).toEqual(BooleanType);
  expect(check('even ((x => x) 0)', context)).toEqual(BooleanType);
});
