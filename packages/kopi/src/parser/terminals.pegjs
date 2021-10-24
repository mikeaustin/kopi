NumericLiteral
  = _ value:([0-9]+ ("." !"." [0-9]+)?) _ {
    return new NumericLiteral({
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`)
    });
  }

StringLiteral
  = _ "\"" value:[^"]* "\"" _ {
      return new StringLiteral({ value: value.join('') });
    }

BooleanLiteral
  = _ value:("true" / "false") _ {
    return new BooleanLiteral({ value: Boolean(value) })
  }

AstLiteral
  = "'("
      exprs:(Newline+ Expression)+ Newline+
    ")" {
      return new AstLiteral({
        value: new TupleExpression({
          elements: exprs.map(expr => expr[1])
        })
      });
    }
  / "'" "(" expr:Statement ")" {
      return new AstLiteral({ value: expr });
    }
  / "'" ident:Identifier {
      return new AstLiteral({ value: ident });
    }

Identifier
  = _ name:([_a-zA-Z][_a-zA-Z0-9]*) _ {
      return new Identifier({
        name: name[0] + name[1].join('')
      });
    }

_
  = Whitespace*

Whitespace
  = [ \t]

Comment
  = _ "#" (!Newline .)*

Newline
  = Comment? [\r?\n]
