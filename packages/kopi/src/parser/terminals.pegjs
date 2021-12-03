NumericLiteral
  = _ value:([0-9]+ ("." !"." [0-9]+)?) _ {
    return new NumericLiteral({
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`),
      location: location(),
    });
  }

StringLiteral
  = _ "\"" value:[^"]* "\"" _ {
      return new StringLiteral({
        value: value.join(''),
        location: location(),
      });
    }

BooleanLiteral
  = _ value:("true" / "false") ![_a-zA-Z] _ {
    return new BooleanLiteral({ value: value === 'true' })
  }

AstLiteral
  = "'(" ident:OperatorIdentifier _ args:(_ NumericLiteral)+ ")" {
      return new AstLiteral({
        value: args.reduce((expr, args) => (
          new ApplyExpression({ expr, args: args[1] })
        ), new Identifier({ name: ident.name }))
      });
    }
  / "'("
      exprs:(Newline+ Expression)+ Newline+
    ")" {
      return new AstLiteral({
        value: new TupleExpression({
          fields: exprs.map(expr => expr[1])
        })
      });
    }
  / "'(" expr:Statement ")" {
      return new AstLiteral({ value: expr });
    }
  / "'" ident:Identifier {
      return new AstLiteral({ value: ident });
    }

Identifier
  = _ name:([_@a-zA-Z][_a-zA-Z0-9]*) _ {
      return new Identifier({
        name: name[0] + name[1].join(''),
        location: location(),
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
