//
// These rules allow us to parse 1 + 2 into an Abstract Syntax Tree
//

{
  const operators = {
    ['+']: (left, right) => visit(left) + visit(right),
    ['-']: (left, right) => visit(left) - visit(right),
  }

  function visit(node) {
    return visitors[node.type](node);
  }

  const visitors = {
    OperatorExpression: ({ op, left, right }) => {
      return operators[op](left, right);
    },

    NumericLiteral: ({ value }) => {
      return value;
    },
  }
}

AddExpression
  = left:Integer _ op:("+" / "-") _ right:Integer {
      return ({
        type: "OperatorExpression",
        op: op,
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
