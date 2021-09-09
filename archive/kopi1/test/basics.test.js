const parser = require("../lib/parser");

const { default: functions } = require('../bin/functions');
const { default: InterpreterVisitors } = require('../bin/InterpreterVisitors');

let visitors = new InterpreterVisitors();
let scope = functions;

test('cps', () => {
  let ast = parser.parse('(x, k => (x, k => k x + 1) x + x, k) 5, (x => x)');

  expect(visitors.visit(ast.statements[0], scope).value).toEqual(11);
});

test('factorial', () => {
  var ast = parser.parse(`
    fix = f => (x => f (y => x x y)) x => f (y => x x y)

    factorial = fix factorial => n => match n (
      0 => 1
      n => n * (factorial n - 1)
    )

    factorial 5
  `);

  expect(visitors.visit(ast, scope).value).toEqual(120);
});

test('match', () => {
  var ast = parser.parse(`
    match 0 (
      0 => "zero"
      x => "other"
    )
  `);

  var ast = parser.parse(`
    match 5 (
      0 => "zero"
      x => "other"
    )
  `);

  expect(visitors.visit(ast, scope).value).toEqual('other');
});

test('pipe', () => {
  var ast = parser.parse(`
    1..5 | map (x => x * x)
  `);

  expect(visitors.visit(ast, scope).value).toEqual([1, 4, 9, 16, 25]);
});

test('tuple zip', () => {
  var ast = parser.parse(`
    1..3, "a".."z" | zip (a, b) => ('toString a) ++ ": " ++ b
  `);

  expect(visitors.visit(ast, scope).value).toEqual(['1: a', '2: b', '3: c']);
});
