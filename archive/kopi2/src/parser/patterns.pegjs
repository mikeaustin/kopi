// --------------------------------------------------------------------------------------------- //
// Patterns
// --------------------------------------------------------------------------------------------- //

Pattern
  = TuplePattern

TuplePattern
  = head:PrimaryPattern tail:(_ "," _ PrimaryPattern)* {
      return tail.length === 0 ? head : new TuplePattern({
        elements: tail.reduce((r, e) => [...r, e[3]], [head])
      })
    }

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
