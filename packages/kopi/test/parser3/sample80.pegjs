//
// This rules allow us to parse a number, such as "5"
// The end result is the value of the parsed number
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
  = leftExpression:NumericLiteral _
    operator:("*" / "/") _
    rightExpression:NumericLiteral {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / NumericLiteral

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(value.join(''))
      };
    }

_ "whitespace"
  = [ \t]*
