import { View, Text, Input, Button, Spacer, Divider, List } from '../components';

const title = 'Introduction';

const subtitle = 'Introduction to learning how to create a programming language.';

const content = (
  <>
    <View horizontal alignItems="center">
      <Text flex fontSize="large" fontWeight="bold">Let’s Build a Programming Language</Text>
    </View>
    <Spacer size="medium" />
    <Text fontSize="medium" fontWeight="bold">
      Introduction
    </Text>
    <Spacer size="xlarge" />
    <Text fontSize="medium">
      You might think that you’d need to be a ninja-level coder, with a bunch of tools and libraries by your side to create a programming language. In reality, if you just want to build a very simple, very basic language to learn how it’s done, it’s not that difficult.
    </Text>
    <Spacer size="large" />
    <Text fontSize="medium">
      This tutorial will guide you through the steps of creating a simple programming language, interactively.
      Even if you're not a developer, you can follow along and try the examples.
    </Text>
    <Spacer size="large" />
    <Text fontSize="medium">
      In the next section, <Text fontWeight="semi-bold">Syntax and Grammar</Text>, we'll talk about the building blocks of creating a language.
    </Text>
  </>
);

const grammar = `
NumericLiteral
  = value:[0-9]+ {
      return Number(value.join(''));
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
