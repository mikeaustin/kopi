//
// These rules allow us to parse 2 + 3 with or without spaces
// The end result is the sum of the two numbers
//

Program
  = expr:AddExpression {
      return expr;
    }

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
