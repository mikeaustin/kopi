//
// This rules allow us to parse a number, such as "5"
// The end result is the value of the parsed number
//

{
  const visitors = {
    NumericLiteral: ({ value }) => {
      return value;
    }
  }

  function visit(node) {
    return visitors[node.type](node);
  }
}

Program
  = expr:NumericLiteral {
      return visit(expr);
    }

NumericLiteral
  = value:[0-9]+ {
      return ({
        type: "NumericLiteral",
        value: Number(value)
      });
    }
