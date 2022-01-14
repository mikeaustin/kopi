import { View, Text, Input, Button, Spacer, Divider, List } from '../components';

const title = 'NumericLiteral';

const subtitle = 'Blah blah balh';

const content = (
  <>
    <View horizontal alignItems="center">
      <Text flex fontSize="large" fontWeight="bold">Let's Build a Programming Language</Text>
    </View>
  </>
);

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
  content,
  grammar,
  language,
};
