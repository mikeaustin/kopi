AddExpression
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((result, [, operator,, value]) => (
        new OperatorExpression({
          op: operator,
          left: result,
          right: value
        })
      ), head);
    }

MultiplyExpression
  = head:FieldExpression tail:(_ ("*" / "/") _ FieldExpression)* {
      return tail.reduce((result, [, operator,, value]) => (
        new OperatorExpression({
          op: operator,
          left: result,
          right: value
        })
      ), head);
    }
