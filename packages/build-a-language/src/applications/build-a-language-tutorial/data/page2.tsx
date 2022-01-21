const title = 'Syntax and Grammar';

const subtitle = 'Learn the building blocks of a programming language.';

const markdown = `
`;

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

const data = {
  grammar,
  language,
};

export {
  title,
  subtitle,
  markdown,
  grammar,
  language,
  data,
};
