const util = require('util');
const fs = require('fs');

async function main() {
  const functions = await util.promisify(fs.readFile)('./src/parser/functions.js', 'utf-8');
  const source = await util.promisify(fs.readFile)('./src/parser/operators.pegjs', 'utf-8');

  const nonTerminals = source.split(/\r?\n\r?\n/).reduce((rules, rule) => {
    const index = rule.search(/\r?\n/);

    return {
      ...rules,
      [rule.slice(0, index)]: rule.slice(index + 1)
    };

  }, {});

  console.error(nonTerminals);

  const rules = [
    'Expression',
    'TupleExpression',
    'AddExpression',
    'MultiplyExpression',
    'ApplyExpression',
    'PrimaryExpression',

    "Pattern",
    "TuplePattern",
    "PrimaryPattern",
    "IdentifierPattern",

    'NumericLiteral',
    'Identifier',

    '_',
    'Whitespace',
    'Newline',
  ];

  const orderedNonTerminals = rules.reverse().reduce(([orderedNonTerminals, nextRule], rule) => (
    [[...orderedNonTerminals, rule + '\n' + nonTerminals[rule].replace(/NextRule/g, nextRule)], rule]
  ), [[], null])[0].reverse();

  console.log(
    '{\n' +
    functions +
    '}\n\n' +
    orderedNonTerminals.join('\n\n')
  );
}


main();
