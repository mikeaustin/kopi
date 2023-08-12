//
// This rules allow us to parse a number, such as "5"
// The end result is the value of the parsed number
//

Program
  = expression:NumericLiteral {
      return expression;
    }

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(text())
      };
    }
