//
// These rules allow us to parse 1 + 2 with or without spaces
//

AddExpression
  = left:NumericLiteral _ op:("+" / "-") _ right:NumericLiteral {
      if (op === '+') return left + right;
      if (op === '-') return left - right;
    }

NumericLiteral
  = value:[0-9]+ {
      return Number(value);
    }

_ "whitespace"
  = [ \t]*
