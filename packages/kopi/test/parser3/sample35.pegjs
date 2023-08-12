//
// This rules allow us to parse a number, such as "5"
// The end result is the value of the parsed number
//

Program
  = expression:Expression {
      return expression;
    }

Expression
  = NumericLiteral

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(text())
      };
    }
