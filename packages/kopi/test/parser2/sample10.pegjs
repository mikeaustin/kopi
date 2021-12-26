//
// These rules allow us to parse a number, such as "5"
// The end result is the sum of the two numbers
//

NumericLiteral
  = value:[0-9]+ {
      return Number(value);
    }
