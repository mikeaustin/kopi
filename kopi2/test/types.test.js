const parser = require("../lib/parser");
const { default: TypecheckVisitors } = require('../src/visitors/TypecheckVisitors');
const { default: initialContext } = require('../bin/context');
const { BooleanType } = require('../src/visitors/types');

let context = initialContext;

const visitors = new TypecheckVisitors();
const bind = types => context = { ...context, ...types };
const check = (line, context) => visitors.visitNode(parser.parse(line), context, bind);

test('Array', () => {
  expect(() => check('[1, "x"]', context)).toThrow(TypeError);
});

test('Argument', () => {
  expect(() => check('even "x"', context)).toThrow(TypeError);
});

test('Lambda', () => {
  expect(check('even 0', context)).toEqual(BooleanType);
  expect(check('not (even 0)', context)).toEqual(BooleanType);
  expect(check('even ((x => x) 0)', context)).toEqual(BooleanType);
});
