EqualityExpression
  = head:NextRule tail:(_ ("==" / "!=" / "<=" / ">=" / "<" / ">") _ NextRule)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }

ConcatinationExpression
  = head:NextRule tail:(_ "++" _ Newline* _ Expression)* {
      return tail.reduce((left, [, op, , , , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }

AddExpression
  = head:NextRule tail:(_ ("+" / "-") _ Newline* _ NextRule)* {
      return tail.reduce((left, [, op, , , , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }

MultiplyExpression
  = head:NextRule tail:(_ ("*" / "/" / "%") _ Newline* _ NextRule)* {
      return tail.reduce((left, [, op, , , , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }
