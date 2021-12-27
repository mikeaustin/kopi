//
// This rules allow us to parse a number, such as "5"
// The end result is the value of the parsed number
//

Program
  = expr:NumericLiteral {
      return expr;
    }

NumericLiteral
  = value:[0-9]+ {
      return ({
        type: "NumericLiteral",
        value: Number(value)
      });
    }
