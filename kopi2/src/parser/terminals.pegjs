// --------------------------------------------------------------------------------------------- //
// Literals
// --------------------------------------------------------------------------------------------- //

Literal
  = NumericLiteral
  / StringLiteral

NumericLiteral "number"
  = literal:[0-9]+ ("." !"." [0-9]+)? {
      return new NumericLiteral({
        value: Number(text()),
        type: Number
      })
    }

StringLiteral "string"
  = '"' chars:(!'"' .)* '"' {
      return new StringLiteral({
        value: chars.map(([, c]) => c).join(""),
        type: String
      });
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
