const util = require("util");
const parser = require("../lib/parser");
const { Function, Tuple, IdentifierPattern } = require('../src/visitors/classes');
const { default: TypecheckVisitors } = require('../src/visitors/TypecheckVisitors');
const { default: initialContext } = require('../bin/context');

const {
  NoneType,
  VoidType,
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

test('Tuple', () => {
  expect(check('()', context)).toEqual(
    VoidType
  );
  expect(check('(5)', context)).toEqual(
    NumberType
  );
  expect(check('(5, "x")', context)).toEqual(
    TupleType(
      NumberType,
      StringType
    )
  );
});

test('Range', () => {
  expect(check('1..5', context)).toEqual(
    RangeType(
      NumberType
    )
  );
  expect(check('(1..5, "z".."z")', context)).toEqual(
    UnionType(
      RangeType(NumberType),
      RangeType(StringType)
    )
  );
});

test('Array', () => {
  expect(check('[]', context)).toEqual(ArrayType(NoneType));
  expect(check('[[]]', context)).toEqual(ArrayType(ArrayType(NoneType)));
  expect(check('[[], []]', context)).toEqual(ArrayType(ArrayType(NoneType)));
  expect(check('[()]', context)).toEqual(ArrayType(VoidType));
  expect(check('[(), ()]', context)).toEqual(ArrayType(VoidType));
  expect(check('[(), 5]', context)).toEqual(ArrayType(UnionType(VoidType, NumberType)));
  expect(check('[5, 5]', context)).toEqual(ArrayType(NumberType));
  expect(check('[5, "x"]', context)).toEqual(ArrayType(UnionType(NumberType, StringType)));
  expect(check('[[5], []]', context)).toEqual(ArrayType(ArrayType(NumberType)));
  expect(check('[[], [5]]', context)).toEqual(ArrayType(ArrayType(NumberType)));
  expect(check('[[], []]', context)).toEqual(ArrayType(ArrayType(NoneType)));
  expect(check('[[5], [5]]', context)).toEqual(ArrayType(ArrayType(NumberType)));
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

test('Lambda', () => {
  expect(check('even', context)).toEqual(FunctionType(new IdentifierPattern('value', NumberType), BooleanType));
  // expect(check('x => x', context)).toEqual(FunctionType(new IdentifierPattern('x', undefined), undefined));
});

test('Application', () => {
  expect(() => check('even "x"', context)).toThrow(TypeError);
  expect(check('even 0', context)).toEqual(BooleanType);
  expect(check('not (even 0)', context)).toEqual(BooleanType);
  expect(check('even ((x => x) 0)', context)).toEqual(BooleanType);
});
