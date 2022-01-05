//
// This rules allow us to parse a number, such as "5"
// The end result is the value of the parsed number
//

{
  const interpreterVisitors = {
    NumericLiteral: ({ value }) => {
      return value;
    }
  }

  function evaluate(node) {
    return interpreterVisitors[node.type](node);
  }
}

Program
  = expression:Expression {
      return evaluate(expression);
    }

Expression
  = NumericLiteral

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(value.join(''))
      };
    }
