//
// These rules allow us to parse 1 + 2 with or without spaces
//

AddExpression
  = left:NumericLiteral _ op:("+" / "-") _ right:NumericLiteral {
      return ({
        typ: 'AddExpression', op, left: left, right: right
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
