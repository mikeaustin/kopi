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

Program
  = expr:Expression {
      return visit(expr);
    }

Expression
  = AddExpression

AddExpression
  = left:NumericLiteral _ op:("+" / "-") _ right:NumericLiteral {
      return ({
        type: "OperatorExpression", op: op, left: left, right: right
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
