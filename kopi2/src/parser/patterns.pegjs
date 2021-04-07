// --------------------------------------------------------------------------------------------- //
// Patterns
// --------------------------------------------------------------------------------------------- //

Pattern
  = PrimaryPattern

PrimaryPattern
  = IdentifierPattern
  / "'" expr:IdentifierPattern {
      return new AstNodeIdentifierPattern({
        _expr: expr
      });
    }

IdentifierPattern
  = name:IdentifierName {
      return new IdentifierPattern({
        _name: name,
      })
    }
