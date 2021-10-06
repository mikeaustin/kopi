const util = require('util');
const fs = require('fs');

async function main() {
  const functions = await util.promisify(fs.readFile)('./src/parser/functions.js', 'utf8');
  const source = await util.promisify(fs.readFile)('./src/parser/operators.pegjs', 'utf8');

  const nonTerminals = source.split('\n\n').reduce((rules, rule) => {
    const index = rule.indexOf('\n');

    return {
      ...rules,
      [rule.slice(0, index)]: rule.slice(index + 1)
    };

  }, {});

  const rules = [
    'Expression',
    'AddExpression',
    'MultiplyExpression',
    'ApplyExpression',
    'PrimaryExpression',
    'NumericLiteral',
    'Identifier',
    '_',
    'Whitespace',
    'Newline',
  ];

  const orderedNonTerminals = rules.reverse().reduce(([orderedNonTerminals, nextRule], rule) => (
    [[...orderedNonTerminals, rule + '\n' + nonTerminals[rule].replace(/NextRule/g, nextRule)], rule]
  ), [[], null])[0].reverse();

  console.log(`{
${functions}}

${orderedNonTerminals.join('\n\n')}`);
}

main();
