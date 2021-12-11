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

AddExpression
  = left:Integer _ "+" _ right:Integer {
      return ({
        type: "AddExpression",
        left: left,
        right: right
      });
    }

Integer
  = [0-9]+ {
    return ({
      type: "Integer",
      value: Number(text())
    });
  }

_ "whitespace"
  = [ \t]*
