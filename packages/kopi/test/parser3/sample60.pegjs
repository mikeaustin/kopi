//
// This rules allow us to parse a number, such as "5"
// The end result is the value of the parsed number
//

{
  const visitors = {
    AddExpression: ({ left, right }) => {
      return visit(left) + visit(right);
    },

    NumericLiteral: ({ value }) => {
      return value;
    }
  }

  function visit(node) {
    return visitors[node.type](node);
  }
}

Program
  = expr:AddExpression {
      return visit(expr);
    }

AddExpression
  = left:NumericLiteral _ "+" _ right:NumericLiteral {
      return ({
        type: "AddExpression",
        left: left,
        right: right
      });
    }

NumericLiteral
  = value:[0-9]+ {
      return ({
        type: "NumericLiteral",
        value: Number(value)
      });
    }

_ "whitespace"
  = [ \t]*
