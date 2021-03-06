const parser = require("../lib/parser");

const { default: functions } = require('../bin/functions');
const { Tuple, Range, Function } = require('../bin/classes');
const { default: PrintASTVisitors } = require('../bin/PrintASTVisitors');

let printASTVisitors = new PrintASTVisitors();

// const ApplyNonFunction =

class BaseError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
  }
}

/*
  SyntaxError
  InterpreterError
  TypeError
  RuntimeError
*/

/*
  ArgumentError
  ApplyNonFunction
*/

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

/* */

class TypeCheckVisitor extends Visitors {
  Comment({ value }, scope) {
    return value;
  }

  Block({ statements }, scope) {
    return statements.reduce((value, statement) => (
      this.visit(statement, scope)
    ), undefined);
  }

  Assignment({ pattern, expr }, scope) {
    const message = `  > ${printASTVisitors.visit(pattern, scope)} = ${printASTVisitors.visit(expr, scope)}`;

    const evaluatedExpr = this.visit(expr, scope).type;

    const matches = pattern.typeMatch(evaluatedExpr, scope);
  }

  TupleExpression({ elements }, scope) {
    return {
      type: elements.map(type => this.visit(type, scope))
    };
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
    x = 1
    inc x
    x = "foo"
    # inc x
    1 = 1
    1 = 2
    # 1 = "2"
    a, b = 1, 1
    inc b
  `);

  try {
    typeCheckVisitors.visit(ast, typeCheckScope);
  } catch (error) {
    console.error('*** Error\n' + error.message);
  }
});
