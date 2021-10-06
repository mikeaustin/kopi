Pattern
  = NextRule

TuplePattern
  = head:NextRule tail:(_ "," _ NextRule)+ {
      return new TuplePattern({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[3]
        ], [head])
      });
    }
  / NextRule

PrimaryPattern
  = _ "(" pattern:Pattern ")" { return pattern; }
  / IdentifierPattern

IdentifierPattern
  = ident:Identifier {
      return new IdentifierPattern({ name: ident.name });
    }
