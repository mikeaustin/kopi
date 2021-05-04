Pattern
  = PrimaryPattern

PrimaryPattern
  = IdentifierPattern

IdentifierPattern
  = name:IdentifierName {
      return new IdentifierPattern({
        name: name,
      })
    }
