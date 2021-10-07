AssignmentPattern
  = NextRule

AssignmentTuplePattern
  = head:NextRule tail:(_ "," _ NextRule)+ {
      return new TuplePattern({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[3]
        ], [head])
      });
    }
  / NextRule

AssignmentPrimaryPattern
  = _ "(" pattern:AssignmentPattern ")" { return pattern; }
  / NumericLiteralPattern
  / AssignmentIdentifierPattern

AssignmentIdentifierPattern
  = ident:Identifier {
      return new IdentifierPattern({ name: ident.name });
    }

//

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
  = ident:Identifier init:(_ "=" _ PrimaryExpression)? {
      return new IdentifierPattern({ name: ident.name, init: init?.[3] });
    }
