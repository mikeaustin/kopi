//
// These rules allow us to parse 1 + 2 with or without spaces
//

AddExpression
  = left:NumericLiteral _ "+" _ right:NumericLiteral {
      return left + right;
    }

NumericLiteral
  = value:[0-9]+ {
      return Number(value);
    }

_ "whitespace"
  = [ \t]*
