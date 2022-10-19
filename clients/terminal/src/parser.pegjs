AddExpression
  = head:NumericLiteral tail:(_ ("+" / "-") _ NumericLiteral)* {
      return tail.reduce((left, [, op, , right]) => ({
        type: 'OperatorExpression',
        op,
        left,
        right
       }), head);
    }

NumericLiteral "number"
  = value:([0-9]+ ("." !"." [0-9]+)?) {
    return {
      type: 'NumericLiteral',
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`),
      location: location(),
    };
  }

_ "whitespace"
  = [ \t]*
