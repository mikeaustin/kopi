import { View, Text, Input, Button, Spacer, Divider, List } from '../components';

const title = 'Parser Rules';

const subtitle = 'Learn what parser rules are and how to create and use them.';

const content = (
  <>
    <View horizontal alignItems="center">
      <Text flex fontSize="large" fontWeight="semi-bold">Let’s Build a Programming Language</Text>
    </View>
    <Spacer size="medium" />
    <Text fontSize="medium" fontWeight="semi-bold">Parser Rules</Text>
    <Spacer size="xlarge" />
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
