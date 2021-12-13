//
// These rules allow us to parse 1 + 2 into an Abstract Syntax Tree
//

{
  function visit(node) {
    return visitors[node.type](node);
  }

  const visitors = {
    AddExpression: ({ left, right }) => {
      return left + right;
    },

    NumericLiteral: ({ value }) => {
      return value;
    },
  }
}

Expression
  = AddExpression

AddExpression
  = left:NumericLiteral _ "+" _ right:NumericLiteral {
      return ({
        type: "AddExpression", left: left, right: right
      });
    }

NumericLiteral
  = value:[0-9]+ {
      return ({
        type: "NumericLiteral", value: Number(value)
      });
    }

_ "whitespace"
  = [ \t]*
