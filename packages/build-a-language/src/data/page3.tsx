import { View, Text, Input, Button, Spacer, Divider, List } from '../components';

const title = 'Abstract Syntax Tree';

const subtitle = 'Learn what parser rules are and how to create and use them.';

const markdown = `
`;

const grammar = `
{
  const interpreterVisitors = {
    AddExpression: ({ leftExpression, rightExpression }) => {
      return evaluate(leftExpression) + evaluate(rightExpression);
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
  = leftExpression:NumericLiteral _ "+" _ rightExpression:NumericLiteral {
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
        value: Number(value.join(''))
      };
    }

_ "whitespace"
  = [ \\t]*
`.trim();

const language = `
2 + 3
`.trim();

export {
  title,
  subtitle,
  markdown,
  grammar,
  language,
};
