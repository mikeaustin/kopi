// Simple Arithmetics Interpreter
// ==============================
//
// Accepts expressions like "2 * (3 + 4)" and computes their value.

{
  function visit(node) {
    return visitors[node.type](node);
  }
  
  const visitors = {
    OperatorExpression({ op, left, right }) {
      if (op === "+") return visit(left) + visit(right);
      if (op === "*") return visit(left) * visit(right);
      if (op === "^") return visit(left) ** visit(right);
    },
    
    NumericLiteral({ value }) {
      return value;
    }
  }
}

Program
  = expr:Expression {
      return visit(expr);
    }
  
Expression
  = AddExpression

AddExpression
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((left, [, op, , right]) => ({
        type: "OperatorExpression", op, left, right
      }), head);
    }

MultiplyExpression
  = head:ExponentExpression tail:(_ ("*" / "/") _ ExponentExpression)* {
      return tail.reduce((left, [, op, , right]) => ({
        type: "OperatorExpression", op, left, right
      }), head);
    }

ExponentExpression
  = left:PrimaryExpression "^" right:Expression {
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
  