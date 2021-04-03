
const util = require("util");
const fs = require("fs");

const parser = require("../lib/parser");

class Node {
  constructor(args) {
    Object.assign(this, args);

    // this._type = this.constructor.name;
  }
}

class Block extends Node { }
// class Assignment extends Node { }
class Literal extends Node { }
// class Identifier extends Node { }
class TupleExpression extends Node { }
class FunctionExpression extends Node { }
class TuplePattern extends Node { }
class IdentifierPattern extends Node { }
// class ApplyExpression extends Node { }
// class OperatorExpression extends Node { }

test('Tuple', () => {
  expect(parser.parse('()').statements[0]).toEqual(new TupleExpression({
    elements: []
  }));

  expect(parser.parse('1, 2').statements[0]).toEqual(new TupleExpression({
    elements: [
      new Literal({ value: 1, type: Number }),
      new Literal({ value: 2, type: Number })
    ],
    fields: [
      null,
      null
    ]
  }));

  expect(parser.parse('1, b: 2').statements[0]).toEqual(new TupleExpression({
    elements: [
      new Literal({ value: 1, type: Number }),
      new Literal({ value: 2, type: Number })
    ],
    fields: [
      null,
      { name: 'b' }
    ]
  }));
});

test('Function', () => {
  expect(parser.parse('() => 1, 2').statements[0]).toEqual(new FunctionExpression({
    params: new TuplePattern({
      elements: []
    }),
    statements: [
      new Block({
        elements: [
          new Literal({ value: 1, type: Number }),
          new Literal({ value: 2, type: Number }),
        ],
        fields: [
          null,
          null,
        ]
      })
    ]
  }));

  expect(parser.parse('a, b => 1, 2').statements[0]).toEqual(new FunctionExpression({
    params: new TuplePattern({
      elements: [
        new IdentifierPattern({ name: 'a' }),
        new IdentifierPattern({ name: 'b' })
      ]
    }),
    statements: [
      new Block({
        elements: [
          new Literal({ value: 1, type: Number }),
          new Literal({ value: 2, type: Number }),
        ],
        fields: [
          null,
          null,
        ]
      })
    ]
  }));
});
