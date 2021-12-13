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
  = left:NumericLiteral _ op:("+" / "-") _ right:NumericLiteral {
      return operators[op](left, right);
    }

NumericLiteral
  = value:[0-9]+ {
    return Number(value);
  }

_ "whitespace"
  = [ \t]*
