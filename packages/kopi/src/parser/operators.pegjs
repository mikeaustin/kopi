Expression
  = expr:NextRule Newline* {
      return expr;
    }

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

ApplyExpression
  = expr:NextRule args:(_ NextRule)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
    }

PrimaryExpression
  = "(" _ expr:Expression _ ")" { return expr; }
  / NumericLiteral
  / Identifier

NumericLiteral
  = _ value:([0-9]+ ("." !"." [0-9]+)?) _ {
    return new NumericLiteral({
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`)
    });
  }

Identifier
  = _ name:([_a-zA-Z][_a-zA-Z0-9]*) _ { return new Identifier({ name: name[0] + name[1].join('') }); }

_
  = Whitespace*

Whitespace
  = [ \t]

Newline
  = [\n\r]
