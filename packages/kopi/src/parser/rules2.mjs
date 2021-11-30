import fs from 'fs';

async function readFiles(...files) {
  return Promise.all(files.map((file) => fs.promises.readFile(file, 'utf-8')));
}

async function main() {
  const functions = await fs.promises.readFile('./src/parser/functions.js', 'utf-8');
  const [types, statements, expressions, operators, primaries, patterns, terminals] = await readFiles(
    './src/parser/types.pegjs',
    './src/parser/statements.pegjs',
    './src/parser/expressions.pegjs',
    './src/parser/operators.pegjs',
    './src/parser/primaries.pegjs',
    './src/parser/patterns.pegjs',
    './src/parser/terminals.pegjs',
  );

  const rulesString = [types, statements, expressions, operators, primaries, patterns, terminals].join('\n');

  const rules = rulesString.split(/\r?\n\r?\n/).reduce((rulesString, rule) => {
    const index = rule.search(/\r?\n/);

    return {
      ...rulesString,
      [rule.slice(0, index)]: rule.slice(index + 1),
    };
  }, {});

  const orderedOperatorRules = [
    'EqualityExpression',
    'ConcatinationExpression',
    'AddExpression',
    'MultiplyExpression',
    'UnaryExpression',
  ];

  const orderedExpressionRules = [
    'Block',
    'Statement',
    'TypeAssignment',
    'TypeExpression',
    'TypeApplyExpression',
    'TupleTypeExpression',
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
    'CalculatedMemberExpression',
    'MemberExpression',
    'PrimaryExpression',
  ];

  const orderedPatternRules = [
    'AssignmentPattern',
    'AssignmentFunctionPattern',
    'AssignmentTuplePattern',
    'AssignmentPrimaryPattern',
    'AssignmentIdentifierPattern',
    'Pattern',
    'TuplePattern',
    'PrimaryPattern',
    'ArrayLiteralPattern',
    'BooleanLiteralPattern',
    'NumericLiteralPattern',
    'StringLiteralPattern',
    'IdentifierPattern',
  ];

  const orderedTerminalRules = [
    'FunctionExpression',
    'ParenthesizedTuple',
    'ArrayExpression',
    'DictExpression',
    'Typename',
    'NumericLiteral',
    'StringLiteral',
    'BooleanLiteral',
    'AstLiteral',
    'OperatorIdentifier',
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
    orderedRulesString.join('\n\n'),
  );
}

main();
