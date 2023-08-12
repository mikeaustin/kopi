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
  };

  const visitors = {
    OperatorExpression: ({ operator, leftExpression, rightExpression }, environment) => {
      const leftValue = evaluate(leftExpression, environment);
      const rightValue = evaluate(rightExpression, environment);

      return operators[operator](leftValue, rightValue);
    },

    FunctionExpression({ param, body }, environment) {
      return new Function(param, body, environment);
    },

    NumericLiteral: ({ value }) => {
      return value;
    },

    Identifier: ({ name }, environment) => {
      return environment[name];
    }
  }

  function evaluate(node) {
    const environment = {};

    return visitors[node.type](node, environment);
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
  / Identifier

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(text())
      };
    }

Identifier "identifier"
  = [a-z]+ {
      return {
        type: 'Identifier',
        name: text()
      }
    }

_ "whitespace"
  = [ \t]*
