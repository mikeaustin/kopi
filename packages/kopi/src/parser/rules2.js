const util = require('util');
const fs = require('fs');

async function main() {
  const functions = await util.promisify(fs.readFile)('./src/parser/functions.js', 'utf-8');
  const expressions = await util.promisify(fs.readFile)('./src/parser/expressions.pegjs', 'utf-8');
  const operators = await util.promisify(fs.readFile)('./src/parser/operators.pegjs', 'utf-8');
  const patterns = await util.promisify(fs.readFile)('./src/parser/patterns.pegjs', 'utf-8');
  const terminals = await util.promisify(fs.readFile)('./src/parser/terminals.pegjs', 'utf-8');

  const rulesString = [expressions, operators, patterns, terminals].join('\n');

  const rules = rulesString.split(/\r?\n\r?\n/).reduce((rulesString, rule) => {
    const index = rule.search(/\r?\n/);

    return {
      ...rulesString,
      [rule.slice(0, index)]: rule.slice(index + 1)
    };

  }, {});

  const orderedExpressionRules = [
    'Expression',
    'TupleExpression',
    'AddExpression',
    'MultiplyExpression',
    'ApplyExpression',
    'PrimaryExpression',
  ];

  const orderedPatternRules = [
    "Pattern",
    "TuplePattern",
    "PrimaryPattern",
    "IdentifierPattern",
  ];

  const orderedTerminalRules = [
    'NumericLiteral',
    'Identifier',
    '_',
    'Whitespace',
    'Newline',
  ];

  const orderedRules = [
    ...orderedExpressionRules,
    ...orderedPatternRules,
    ...orderedTerminalRules,
  ];

  const orderedRulesString = orderedRules.reverse().reduce(([orderedRulesString, nextRule], rule) => (
    [[...orderedRulesString, rule + '\n' + rules[rule].replace(/NextRule/g, nextRule)], rule]
  ), [[], null])[0].reverse();

  console.log(
    '{\n' +
    functions +
    '}\n\n' +
    orderedRulesString.join('\n\n')
  );
}

main();
