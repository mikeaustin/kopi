//
// Parses syntax into an AST, then interprets it directly.
// Accepts expressions such as "2 * (3 + 4)".
//

{
  const operatorFunctions = {
    ['+']: (leftValue, rightValue) => leftValue + rightValue,
    ['-']: (leftValue, rightValue) => leftValue - rightValue,
    ['*']: (leftValue, rightValue) => leftValue * rightValue,
    ['/']: (leftValue, rightValue) => leftValue / rightValue,
  }

  const interpreterVisitors = {
    OperatorExpression: ({ operator, leftExpression, rightExpression }) => {
      const leftValue = evaluate(leftExpression, environment);
      const rightValue = evaluate(rightExpression, environment);

      return operatorFunctions[operator](leftValue, rightValue, environment);
    },

    NumericLiteral: ({ value }) => {
      return value;
    }
  }

  function evaluate(node) {
    return interpreterVisitors[node.type](node);
  }
}

Program
  = expression:Expression {
      return evaluate(expression);
    }

Expression
  = AddExpression

AddExpression
  = leftExpression:MultiplyExpression _ operator:("+" / "-") _ rightExpression:MultiplyExpression {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / MultiplyExpression

MultiplyExpression
  = leftExpression:PrimaryExpression _ operator:("*" / "/") _ rightExpression:PrimaryExpression {
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
        value: Number(value.join(''))
      };
    }

_ "whitespace"
  = [ \t]*
