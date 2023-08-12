//
// Parses syntax into an AST, then interprets it directly.
// Accepts expressions such as "2 * (3 + 4)".
//

{
  const operators = {
    ['+']: (leftValue, rightValue) => leftValue + rightValue,
    ['-']: (leftValue, rightValue) => leftValue - rightValue,
    ['*']: (leftValue, rightValue) => leftValue * rightValue,
    ['/']: (leftValue, rightValue) => leftValue / rightValue,
  }

  const visitors = {
    OperatorExpression: ({ operator, leftExpression, rightExpression }) => {
      const leftValue = evaluate(leftExpression);
      const rightValue = evaluate(rightExpression);

      return operators[operator](leftValue, rightValue);
    },

    NumericLiteral: ({ value }) => {
      return value;
    }
  }

  function evaluate(node) {
    return visitors[node.type](node);
  }
}

Program
  = expression:Expression {
      return evaluate(expression);
    }

Expression
  = AddExpression

AddExpression
  = leftExpression:MultiplyExpression _
    operator:("+" / "-") _
    rightExpression:MultiplyExpression {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / MultiplyExpression

MultiplyExpression
  = leftExpression:PrimaryExpression _
    operator:("*" / "/") _
    rightExpression:PrimaryExpression {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / PrimaryExpression

PrimaryExpression
  = "(" expression:AddExpression ")" {
    return expression;
  }
  / NumericLiteral

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(text())
      };
    }

_ "whitespace"
  = [ \t]*
