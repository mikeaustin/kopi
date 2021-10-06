const util = require('util');
const fs = require('fs');

async function main() {
  const functions = await util.promisify(fs.readFile)('./src/parser/functions.js', 'utf-8');
  const expressions = await util.promisify(fs.readFile)('./src/parser/expressions.pegjs', 'utf-8');
  const operators = await util.promisify(fs.readFile)('./src/parser/operators.pegjs', 'utf-8');
  const patterns = await util.promisify(fs.readFile)('./src/parser/patterns.pegjs', 'utf-8');
  const terminals = await util.promisify(fs.readFile)('./src/parser/terminals.pegjs', 'utf-8');

  const rules = [expressions, operators, patterns, terminals].join('\n');

  const nonTerminals = rules.split(/\r?\n\r?\n/).reduce((rules, rule) => {
    const index = rule.search(/\r?\n/);

    return {
      ...rules,
      [rule.slice(0, index)]: rule.slice(index + 1)
    };

  }, {});

  console.error(nonTerminals);

  const orderedRules = [
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

  const orderedNonTerminals = orderedRules.reverse().reduce(([orderedNonTerminals, nextRule], rule) => (
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
