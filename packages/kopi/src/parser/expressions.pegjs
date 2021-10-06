Expression
  = expr:NextRule Newline* {
      return expr;
    }

TupleExpression
  = head:NextRule tail:(_ "," _ NextRule)+ {
      return new TupleExpression({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[3]
        ], [head])
      });
  }
  / NextRule

AddExpression
  = head:NextRule tail:(_ ("+" / "-") _ NextRule)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }
