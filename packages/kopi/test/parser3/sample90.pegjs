//
// Parses syntax into an AST, then interprets it directly.
// Accepts expressions such as "2 * (3 + 4)".
//

{
  const operators = {
    ['+']: (left, right) => left + right,
    ['-']: (left, right) => left - right,
    ['*']: (left, right) => left * right,
    ['/']: (left, right) => left / right,
  }

  const visitors = {
    OperatorExpression: ({ op, left, right }) => {
      return operators[op](visit(left), visit(right));
    },

    NumericLiteral: ({ value }) => {
      return value;
    }
  }

  function visit(node) {
    return visitors[node.type](node);
  }
}

Program
  = expr:AddExpression {
      return visit(expr);
    }

AddExpression
  = left:MultiplyExpression _ op:("+" / "-") _ right:MultiplyExpression {
      return ({
        type: "OperatorExpression",
        op: op,
        left: left,
        right: right
      });
    }
  / MultiplyExpression

MultiplyExpression
  = left:PrimaryExpression _ op:("*" / "/") _ right:PrimaryExpression {
      return ({
        type: "OperatorExpression",
        op: op,
        left: left,
        right: right
      });
    }
  / PrimaryExpression

PrimaryExpression
  = "(" expr:AddExpression ")" {
    return expr;
  }
  / NumericLiteral

NumericLiteral
  = value:[0-9]+ {
      return ({
        type: "NumericLiteral",
        value: Number(value)
      });
    }

_ "whitespace"
  = [ \t]*
