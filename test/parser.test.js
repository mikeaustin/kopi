
const util = require("util");
const fs = require("fs");

const parser = require("../lib/parser");

class Node {
  constructor(args) {
    Object.assign(this, args);
  }
}

class Block extends Node { }
class Assignment extends Node { }
class Literal extends Node { }
class Identifier extends Node { }
class TupleExpression extends Node { }
class FunctionExpression extends Node { }
class TuplePattern extends Node { }
class ApplyExpression extends Node { }
class OperatorExpression extends Node { }

const source = [
  `
    ()
  `,
];

test('adds 1 + 2 to equal 3', () => {
  expect(parser.parse('()')).toEqual([new TupleExpression({
    elements: []
  })]);

  expect(parser.parse('1, 2')).toEqual([new TupleExpression({
    elements: [
      new Literal({ value: 1 }),
      new Literal({ value: 2 })
    ]
  })]);

  expect(parser.parse('2.5, "foo"')).toEqual([new TupleExpression({
    elements: [
      new Literal({ value: 2.5 }),
      new Literal({ value: 'foo' })
    ]
  })]);

  expect(parser.parse('() => 1, 2, 3')).toEqual([new FunctionExpression({
    params: new TupleExpression({
      elements: []
    }),
    statements: [
      new Block({
        elements: [
          new Literal({ value: 1 }),
          new Literal({ value: 2 }),
          new Literal({ value: 3 }),
        ]
      })
    ]
  })]);
});
