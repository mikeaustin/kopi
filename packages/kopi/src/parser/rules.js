//
// Experiment to abstract out rule precedence. Run "node rules.js" to see the output.
//

const functions = `
  class Node {
    constructor(args) {
      Object.assign(this, args);
    }
  }

  class OperatorExpression extends Node { }

  class NumericLiteral extends Node { }
`;

const nonTerminals = {
  Expression: NextRule => `
    = expr:${NextRule} Newline* {
        return expr;
      }
  `,

  AddExpression: NextRule => `
    = head:${NextRule} tail:(_ ("+" / "-") _ ${NextRule})* {
        return tail.reduce((left, [, op, , right]) => (
          new OperatorExpression({ op, left, right })
        ), head);
      }
  `,
  MultiplyExpression: NextRule => `
    = head:${NextRule} tail:(_ ("*" / "/") _ ${NextRule})* {
        return tail.reduce((left, [, op, , right]) => (
          new OperatorExpression({ op, left, right })
        ), head);
      }
  `,
  PrimaryExpression: NextRule => `
    = NumericLiteral
    / Identifier
  `
};

const terminals = {
  Identifier: `
    = [a-zA-Z][a-zA-Z0-9]* _ { return text(); }
  `,

  NumericLiteral: `
    = _ value:([0-9]+ ("." !"." [0-9]+)?) _ {
      return new NumericLiteral({
        value: Number(\`\${value[0].join('')}.\${value[1] ? value[1][2].join('') : ''}\`)
      });
    }
  `,

  _: `
    = Whitespace*
  `,

  Whitespace: `
    = [ \\t]
  `,

  Newline: `
    = [\\n\\r]
  `
};

const rules = [
  'Expression',
  'AddExpression',
  'MultiplyExpression',
  'PrimaryExpression'
];

const orderedNonTerminals = rules.reverse().reduce(([orderedNonTerminals, nextRule], rule) => (
  [[...orderedNonTerminals, rule + nonTerminals[rule](nextRule)], rule]
), [[], null])[0].reverse();

const orderedTerminals = Object.entries(terminals).map(([name, rule]) => name + rule);

console.log(`
{${functions}}

${orderedNonTerminals.join('\n')}
${orderedTerminals.join('\n')}
`);
