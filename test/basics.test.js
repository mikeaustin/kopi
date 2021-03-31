const parser = require("../lib/parser");

const { default: functions } = require('../bin/functions');
const { Tuple, Range, Function } = require('../bin/classes');

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

//

class Visitors {
  visit(node, scope) {
    if (node === null) {
      return { value: undefined };
    }

    if (this[node.constructor.name]) {
      return this[node.constructor.name](node, scope);
    } else {
      throw new Error(`No AST visitor for '${node.constructor.name}'`);
    }
  }
}

/*

Number.+ that: Number

1 + 1

*/

class TypeCheckVisitor extends Visitors {
  OperatorExpression({ op, left, right }, scope) {
    const evaluatedLeft = this.visit(left, scope);
    const evaluatedRight = this.visit(right, scope);

    console.log('>', evaluatedLeft, '<', scope);

    const error = message => fail(`> ${evaluatedLeft.value} ${op} ${evaluatedRight.value}\n` + message);

    if (!evaluatedLeft.type) {
      return error(`Variable '${evaluatedLeft.value}' is not defined.`);
    }

    if (!evaluatedLeft.type.prototype[op]) {
      return error(`Method ${op} is not defined for type '${evaluatedLeft.type.name}'.`);
    }

    if (evaluatedLeft.type.signatures[op]?.[0] !== evaluatedRight.type) {
      return error(`Argument to '${evaluatedLeft.type.name}.${op}' expected to be type '${evaluatedLeft.type.signatures[op]?.[0].name}', but found '${evaluatedRight.type.name}'.`);
    }
  }

  Identifier({ name }, scope) {
    return {
      value: name,
      type: scope[name]
    };
  }

  Literal({ value }, scope) {
    return {
      value: typeof value === 'number' ? value : `"${value}"`,
      type: typeof value === 'number' ? Number : String
    };
  }
}

Number.signatures = {
  ['+']: [Number]
};

const typeCheckVisitors = new TypeCheckVisitor();
const typeCheckScope = {
  pi: Number
};

test('tuple zip', () => {
  var ast = parser.parse(`
    1 + "two"
  `);

  typeCheckVisitors.visit(ast.statements[0], typeCheckScope);
});
