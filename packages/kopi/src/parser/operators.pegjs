AddExpression
  = head:NextRule tail:(_ ("+" / "-") _ NextRule)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }

MultiplyExpression
  = head:NextRule tail:(_ ("*" / "/" / "%") _ NextRule)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }
