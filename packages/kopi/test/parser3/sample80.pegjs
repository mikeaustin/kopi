//
// This rules allow us to parse a number, such as "5"
// The end result is the value of the parsed number
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
  = left:NumericLiteral _ op:("*" / "/") _ right:NumericLiteral {
      return ({
        type: "OperatorExpression",
        op: op,
        left: left,
        right: right
      });
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
