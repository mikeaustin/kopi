const parser = require("../lib/parser");

const { default: functions } = require('../bin/functions');
const { Tuple, Range, Function } = require('../bin/classes');

const { default: InterpreterVisitors } = require('../bin/InterpreterVisitors');

let visitors = new InterpreterVisitors();
let scope = functions;

test('(x, k => (x, k => k x + 1) x + x, k) 5, (x => x) equals 11', () => {
  let ast = parser.parse('(x, k => (x, k => k x + 1) x + x, k) 5, (x => x)');

  expect(visitors.visit(ast.statements[0], scope).value).toEqual(11);
});

test('factorial', () => {
  let ast = parser.parse(`
    fix = f => (x => f (y => x x y)) x => f (y => x x y)

    factorial = fix factorial => n => match n (
      0 => 1
      n => n * (factorial n - 1)
    )

    factorial 5
  `);

  expect(visitors.visit(ast, scope).value).toEqual(120);
});
