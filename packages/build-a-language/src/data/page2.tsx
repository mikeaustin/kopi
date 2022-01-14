import { View, Text, Input, Button, Spacer, Divider, List } from '../components';

const title = 'Syntax and Grammar';

const subtitle = 'Learn the building blocks of a programming language.';

const content = (
  <>
    <View horizontal alignItems="center">
      <Text flex fontSize="large" fontWeight="bold">Let’s Build a Programming Language</Text>
    </View>
    <Spacer size="medium" />
    <Text fontSize="medium" fontWeight="bold">Syntax and Grammar</Text>
    <Spacer size="xlarge" />
  </>
);

const grammar = `
Program
  = expression:NumericLiteral {
      return expression;
    }

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(value.join(''))
      };
    }
`.trim();

const language = `
2
`.trim();

export {
  title,
  subtitle,
  content,
  grammar,
  language,
};
