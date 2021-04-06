// --------------------------------------------------------------------------------------------- //
// Patterns
// --------------------------------------------------------------------------------------------- //

Pattern
  = PrimaryPattern

PrimaryPattern
  = IdentifierPattern

IdentifierPattern
  = name:IdentifierName {
      return new IdentifierPattern({
        _name: name,
      })
    }
