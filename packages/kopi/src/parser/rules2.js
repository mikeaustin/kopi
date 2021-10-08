const util = require('util');
const fs = require('fs');

async function readFiles(...files) {
  return Promise.all(files.map(file => util.promisify(fs.readFile)(file, 'utf-8')));
}

async function main() {
  const functions = await util.promisify(fs.readFile)('./src/parser/functions.js', 'utf-8');
  const [statements, expressions, operators, primaries, patterns, terminals] = await readFiles(
    './src/parser/statements.pegjs',
    './src/parser/expressions.pegjs',
    './src/parser/operators.pegjs',
    './src/parser/primaries.pegjs',
    './src/parser/patterns.pegjs',
    './src/parser/terminals.pegjs',
  );

  const rulesString = [statements, expressions, operators, primaries, patterns, terminals].join('\n');

  const rules = rulesString.split(/\r?\n\r?\n/).reduce((rulesString, rule) => {
    const index = rule.search(/\r?\n/);

    return {
      ...rulesString,
      [rule.slice(0, index)]: rule.slice(index + 1)
    };
  }, {});

  const orderedOperatorRules = [
    'EqualityExpression',
    'ConcatinationExpression',
    'AddExpression',
    'MultiplyExpression',
  ];

  const orderedExpressionRules = [
    'Block',
    'Statement',
    'Assignment',
    'Expression',
    'LowPrecedenceApplyExpression',
    // Flip Pipe and Tuple for Array/Dict?
    // Can't: print $ 1..2, "a".."z" | map (a, b) => a, b
    'PipeExpression',
    'TupleExpression',
    ...orderedOperatorRules,
    'ApplyExpression',
    'RangeExpression',
    'MemberExpression',
    'PrimaryExpression',
  ];

  const orderedPatternRules = [
    'AssignmentPattern',
    'AssignmentTuplePattern',
    'AssignmentPrimaryPattern',
    'AssignmentIdentifierPattern',
    'Pattern',
    'TuplePattern',
    'PrimaryPattern',
    'NumericLiteralPattern',
    'StringLiteralPattern',
    'IdentifierPattern',
  ];

  const orderedTerminalRules = [
    'FunctionExpression',
    'ParenthesizedTuple',
    'ArrayExpression',
    'DictExpression',
    'NumericLiteral',
    'StringLiteral',
    'AstLiteral',
    'Identifier',
    '_',
    'Whitespace',
    'Comment',
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
