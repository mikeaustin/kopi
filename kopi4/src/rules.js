//
// Experiment to abstract out rule precedence. Run "node rules.js" to see the output.
//

const nonTerminals = {
  Expression: NextRule => `
    = AddExpression
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
    = Identifier
  `
};

const terminals = {
  Identifier: `
    = [a-zA-Z][a-zA-Z0-9]* _ { return text(); }
  `
};

const precedence = [
  'Expression',
  'AddExpression',
  'MultiplyExpression',
  'PrimaryExpression'
];

const orderedNonTerminals = precedence.reverse().reduce(([orderedNonTerminals, nextRule], rule) => (
  [[...orderedNonTerminals, rule + nonTerminals[rule](nextRule)], rule]
), [[], null])[0].reverse();

const orderedTerminals = Object.entries(terminals).map(([name, rule]) => name + rule);

console.log(orderedNonTerminals.join('\n') + '\n' + orderedTerminals.join('\n'));
