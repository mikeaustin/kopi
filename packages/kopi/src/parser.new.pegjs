
{
  class Node {
    constructor(args) {
      Object.assign(this, args);
    }
  }

  class OperatorExpression extends Node { }
  class ApplyExpression extends Node { }

  class NumericLiteral extends Node { }
  class Identifier extends Node { }
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
    = head:ApplyExpression tail:(_ ("*" / "/") _ ApplyExpression)* {
        return tail.reduce((left, [, op, , right]) => (
          new OperatorExpression({ op, left, right })
        ), head);
      }
  
ApplyExpression
    = expr:PrimaryExpression args:(_ PrimaryExpression)* {
        return args.reduce((expr, [, args]) => (
          new ApplyExpression({ expr, args })
        ), expr)
      }
  
PrimaryExpression
    = "(" _ expr:Expression _ ")" { return expr; }
    / NumericLiteral
    / Identifier
  
Identifier
    = _ name:([_a-zA-Z][_a-zA-Z0-9]*) _ {
      return new Identifier({ name: name[0] + name[1].join('') });
    }
  
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
  

