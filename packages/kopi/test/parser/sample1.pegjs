//
// These rules allow us to parse 1+2 with no spaces between
//

AddExpression
  = left:Integer "+" right:Integer {
      return left + right;
    }

Integer
  = [0-9]+ {
    return Number(text());
  }
  