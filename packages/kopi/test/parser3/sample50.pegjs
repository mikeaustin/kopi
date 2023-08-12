//
// This rules allow us to parse a number, such as "5"
// The end result is the value of the parsed number
//

{
  const visitors = {
    AddExpression: ({ leftExpression, rightExpression }) => {
      return evaluate(leftExpression) + evaluate(rightExpression);
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
  = leftExpression:NumericLiteral "+" rightExpression:NumericLiteral {
      return {
        type: 'AddExpression',
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(text())
      };
    }
