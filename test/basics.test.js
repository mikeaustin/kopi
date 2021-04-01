const parser = require("../lib/parser");

const { default: functions } = require('../bin/functions');
const { Tuple, Range, Function } = require('../bin/classes');

const { default: InterpreterVisitors } = require('../bin/InterpreterVisitors');
const { default: PrintASTVisitors } = require('../bin/PrintASTVisitors');

let visitors = new InterpreterVisitors();
let printASTVisitors = new PrintASTVisitors();
let scope = functions;

const ApplyNonFunction =

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
  Block({ statements }, scope) {
    return statements.reduce((value, statement) => (
      this.visit(statement, scope)
    ), undefined);
  }

  ApplyExpression({ expr, args }, scope) {
    const message = `  > ${printASTVisitors.visit(expr, scope)} ${printASTVisitors.visit(args, scope)}`;

    try {
      const evaluatedExpr = this.visit(expr, scope);
      const evaluatedArgs = this.visit(args, scope);

      if (evaluatedArgs.type !== evaluatedExpr.type.params[0].type) {
        throw new Error(`    Argument to function '${printASTVisitors.visit(expr, scope)}' should be of type '${evaluatedExpr.type.params[0].type.name}', but found ${evaluatedArgs.value} of type '${evaluatedArgs.type.name}'.`);
      }
    } catch (error) {
      throw new Error(`${message}\n${error.message}`);
    }
  }

  OperatorExpression({ op, left, right }, scope) {
    const message = `  > ${printASTVisitors.visit(left, scope)} ${op} ${printASTVisitors.visit(right, scope)}`;

    try {
      const evaluatedLeft = this.visit(left, scope);
      const evaluatedRight = this.visit(right, scope);

      if (!evaluatedLeft.type.prototype[op]) {
        throw new Error(`    Method ${op} is not defined for type '${evaluatedLeft.type.name}'.`);
      }

      if (evaluatedLeft.type.signatures[op]?.[0] !== evaluatedRight.type) {
        throw new Error(`    Argument to operator '${evaluatedLeft.type.name}.${op}' should be of type '${evaluatedLeft.type.signatures[op]?.[0].name}', but found ${evaluatedRight.value} of type '${evaluatedRight.type.name}'.`);
      }
    } catch (error) {
      throw new Error(`${message}\n${error.message}`);
    }
  }

  Identifier({ name }, scope) {
    if (!scope[name]) {
      throw new Error(`    Variable '${name}' is not defined.`);
    }

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
  print: Function,
  inc: { params: [{ name: name, type: Number }] }
};

test('type checking', () => {
  var ast = parser.parse(`
    inc 1
    1 + 1
  `);

  try {
    typeCheckVisitors.visit(ast, typeCheckScope);
  } catch (error) {
    console.error('*** Error\n' + error.message);
  }
});
