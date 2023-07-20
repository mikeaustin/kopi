const title = 'Parser Rules';

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

const data = {
  grammar,
  language,
};

export {
  title,
  subtitle,
  markdown,
  data,
};
