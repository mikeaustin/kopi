const { AnyType, NoneType, NumberType, StringType, UnionType } = require('../src/visitors/types');

/*

Number <: Number | String

Number | String :> Number

Float <: Number | String

covariant
contravariant

*/

class FloatType extends NumberType.constructor { }

test('Any/None', () => {
  expect(
    AnyType.isSupertypeOf(AnyType)
  ).toBe(true);

  expect(
    AnyType.isSupertypeOf(NoneType)
  ).toBe(true);

  expect(
    NoneType.isSubtypeOf(AnyType)
  ).toBe(true);

  expect(
    NoneType.isSubtypeOf(NoneType)
  ).toBe(true);

  expect(
    AnyType.isSupertypeOf(NumberType)
  ).toBe(true);

  expect(
    NumberType.isSubtypeOf(AnyType)
  ).toBe(true);
});

test('Primitives', () => {
  expect(
    NumberType.isSubtypeOf(NumberType)
  ).toBe(true);

  expect(
    NumberType.isSupertypeOf(NumberType)
  ).toBe(true);

  expect(
    new FloatType().isSubtypeOf(NumberType)
  ).toBe(true);

  expect(
    NumberType.isSupertypeOf(new FloatType())
  ).toBe(true);

  expect(
    UnionType(NumberType, StringType).isSupertypeOf(NumberType)
  ).toBe(true);

  expect(
    NumberType.isSubtypeOf(UnionType(NumberType, StringType))
  ).toBe(true);


  expect(
    NumberType.isSubtypeOf(StringType)
  ).toBe(false);

  // expect(
  //   UnionType(StringType, NumberType).isSupertypeOf(NumberType)
  // ).toBe(true);
});
