
const util = require("util");
const fs = require("fs");

const parser = require("../lib/parser");

const source = [
  `
    ()
  `,
];

test('adds 1 + 2 to equal 3', () => {
  // console.log(ast);

  expect(parser.parse('()')).toEqual([{
    elements: []
  }]);

  expect(parser.parse('1, 2')).toEqual([{
    elements: [{ value: 1 }, { value: 2 }]
  }]);

  expect(parser.parse('2.5, foo')).toEqual([{
    elements: [{ value: 2.5 }, { name: 'foo' }]
  }]);

  expect(parser.parse('() => 1, 2, 3')).toEqual([{
    params: [{
      elements: []
    }],
    statements: [
      {
        elements: [
          { value: 1 },
          { value: 2 },
          { value: 3 },
        ]
      }
    ]
  }]);
});
