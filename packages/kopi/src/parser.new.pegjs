
{
  class Node {
    constructor(args) {
      Object.assign(this, args);
    }
  }

  class OperatorExpression extends Node { }

  class NumericLiteral extends Node { }
}

Expression
    = expr:AddExpression Newline* {
        return expr;
      }
  
AddExpression
    = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
        return tail.reduce((left, [, op, , right]) => (
          new OperatorExpression({ op, left, right })
        ), head);
      }
  
MultiplyExpression
    = head:PrimaryExpression tail:(_ ("*" / "/") _ PrimaryExpression)* {
        return tail.reduce((left, [, op, , right]) => (
          new OperatorExpression({ op, left, right })
        ), head);
      }
  
PrimaryExpression
    = NumericLiteral
    / Identifier
  
Identifier
    = [a-zA-Z][a-zA-Z0-9]* _ { return text(); }
  
NumericLiteral
    = _ value:([0-9]+ ("." !"." [0-9]+)?) _ {
      return new NumericLiteral({
        value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`)
      });
    }
  
_
    = Whitespace*
  
Whitespace
    = [ \t]
  
Newline
    = [\n\r]
  

