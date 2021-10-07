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
  / NumericLiteralPattern
  / IdentifierPattern

NumericLiteralPattern
  = number:NumericLiteral {
      return new NumericLiteralPattern({ value: number.value });
    }

IdentifierPattern
  = ident:Identifier {
      return new IdentifierPattern({ name: ident.name });
    }
