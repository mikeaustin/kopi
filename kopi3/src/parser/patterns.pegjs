Pattern
  = FunctionPattern
  / PrimaryPattern

FunctionPattern
  = name:IdentifierName _ params:Pattern {
      return new FunctionPattern({
        name: name,
        params: params
      })
    }

PrimaryPattern
  = IdentifierPattern

IdentifierPattern
  = name:IdentifierName {
      return new IdentifierPattern({
        name: name
      })
    }
