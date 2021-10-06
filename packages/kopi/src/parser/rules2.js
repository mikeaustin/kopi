const util = require('util');
const fs = require('fs');

async function readFiles(...files) {
  return Promise.all(files.map(file => util.promisify(fs.readFile)(file, 'utf-8')));
}

async function main() {
  const functions = await util.promisify(fs.readFile)('./src/parser/functions.js', 'utf-8');
  const [statements, expressions, operators, patterns, terminals] = await readFiles(
    './src/parser/statements.pegjs',
    './src/parser/expressions.pegjs',
    './src/parser/operators.pegjs',
    './src/parser/patterns.pegjs',
    './src/parser/terminals.pegjs',
  );

  const rulesString = [statements, expressions, operators, patterns, terminals].join('\n');

  const rules = rulesString.split(/\r?\n\r?\n/).reduce((rulesString, rule) => {
    const index = rule.search(/\r?\n/);

    return {
      ...rulesString,
      [rule.slice(0, index)]: rule.slice(index + 1)
    };
  }, {});

  const orderedOperatorRules = [
    'AddExpression',
    'MultiplyExpression',
  ];

  const orderedExpressionRules = [
    'Block',
    'Statement',
    'Assignment',
    'Expression',
    'TupleExpression',
    ...orderedOperatorRules,
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
