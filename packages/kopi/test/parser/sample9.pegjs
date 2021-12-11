// Simple Arithmetics Interpreter
// ==============================
//
// Parses syntax into an AST, then interprets the AST directly.
// Accepts expressions such as "2 * (3 + 4)" and computes their value.

{
  function visit(node) {
    return visitors[node.type](node);
  }

  const operators = {
    ['+']: (left, right) => visit(left) + visit(right),
    ['*']: (left, right) => visit(left) * visit(right),
    ['^']: (left, right) => visit(left) ** visit(right),
  }

  const visitors = {
    OperatorExpression: ({ op, left, right }) => {
      return operators[op](left, right);
    },

    NumericLiteral: ({ value }) => {
      return value;
    },
  }
}

Program  // First rule that is run. In this case, interpret program.
  = expr:Expression {
      return visit(expr);
    }

Expression  // Alias so we can add lower precedence operations
  = AddExpression

AddExpression  // Left-associative using looping (* operator)
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((left, [, op, , right]) => ({
        type: "OperatorExpression", op, left, right
      }), head);
    }

MultiplyExpression  // Higher precedence than AddExpression
  = head:ExponentExpression tail:(_ ("*" / "/") _ ExponentExpression)* {
      return tail.reduce((left, [, op, , right]) => ({
        type: "OperatorExpression", op, left, right
      }), head);
    }

ExponentExpression  // Right-associative using recursion (self-reference)
  = left:PrimaryExpression "^" right:ExponentExpression {
      return ({ type: "OperatorExpression", op: "^", left, right });
    }
    / PrimaryExpression

PrimaryExpression
  = "(" _ expr:Expression _ ")" { return expr; }
  / NumericLiteral

NumericLiteral "integer"
  = _ [0-9]+ {
      return ({
        type: "NumericLiteral", value: Number(text())
      });
    }

_ "whitespace"
  = [ \t]*
