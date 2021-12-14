//
// These rules allow us to parse 1+2 with no spaces between
//

AddExpression
  = left:NumericLiteral "+" right:NumericLiteral {
      return left + right;
    }

NumericLiteral
  = value:[0-9]+ {
    return Number(value);
  }
