import { View, Text, Input, Button, Spacer, Divider, List } from '../components';

const content = (
  <>
    <View horizontal alignItems="center">
      <Text flex fontSize="large">Let's Build a Programming Language</Text>
    </View>
    <Spacer size="large" />
    <Text fontSize="medium">You might think that you'd need to be a ninja-level coder, with a bunch of tools and libraries by your side to create a programming language. In reality, if you just want to build a very simple, very basic language to learn how it's done, it's not that difficult.</Text>
    <Spacer size="large" />
    <Text fontSize="medium">We'll be using a simple online editor, so you don't even need to download or install anything: https://pegjs.org/online. Even if you're not a developer, you can follow along and try the examples.</Text>
    <Spacer size="large" />
    <Text fontSize="medium">Syntax and Grammar</Text>
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
  content,
  grammar,
  language,
};
