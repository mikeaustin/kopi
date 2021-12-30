//
// These rules allow us to parse 2 + 3 with or without spaces
// The result is an Abstract Syntax Tree representing the sum of two numbers
//

Program
  = expr:AddExpression {
      return expr;
    }

AddExpression
  = left:NumericLiteral _ op:"+" _ right:NumericLiteral {
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
