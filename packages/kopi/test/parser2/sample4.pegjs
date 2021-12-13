//
// These rules allow us to parse 1 + 2 with or without spaces
//

{
  const operators = {
    ['+']: (left, right) => left + right,
    ['-']: (left, right) => left - right
  }
}

Expression
  = AddExpression

AddExpression
  = head:NumericLiteral tail:(_ ("+" / "-") _ NumericLiteral)* {
      return tail.reduce((left, [, op, , right]) => (
        operators[op](left, right)
      ), head);
    }

NumericLiteral
  = value:[0-9]+ {
    return Number(value);
  }

_ "whitespace"
  = [ \t]*
