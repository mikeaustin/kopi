//
// These rules allow us to parse 1 + 2 with or without spaces
//

{
  const visitors = {
    AddExpression: ({ op, left, right }) => {
      if (op === '+') return visit(left) + visit(right);
      if (op === '-') return visit(left) - visit(right);
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
  = left:NumericLiteral _ op:("+" / "-") _ right:NumericLiteral {
      return ({
        type: 'AddExpression', op, left: left, right: right
      })
    }

NumericLiteral
  = value:[0-9]+ {
      return ({
        type: 'NumericLiteral', value: Number(value)
      });
    }

_ "whitespace"
  = [ \t]*
