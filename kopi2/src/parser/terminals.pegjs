// --------------------------------------------------------------------------------------------- //
// Literals
// --------------------------------------------------------------------------------------------- //

Literal
  = NumericLiteral
  / StringLiteral
  / ArrayLiteral

NumericLiteral "number"
  = literal:[0-9]+ ("." !"." [0-9]+)? {
      return new NumericLiteral({
        value: Number(text()),
      })
    }

StringLiteral "string"
  = '"' chars:(!'"' .)* '"' {
      return new StringLiteral({
        value: chars.map(([, c]) => c).join(""),
      });
    }

ArrayLiteral
  = "[" head:ApplyExpressionInArrayExpression tail:(_ "," _ ApplyExpressionInArrayExpression)* "]" {
      return new ArrayLiteral({
        elements: tail.reduce((result, [,,, expr]) => [...result, expr], [head])
      })
    }
  / "[]" {
    return new ArrayLiteral({
      elements: []
    })
  }

Identifier "identifier"
  = name:IdentifierName {
      return new Identifier({
        name: name,
      })
    }

IdentifierName
  = [a-z][a-zA-Z0-9]* {
      return text();
    }
