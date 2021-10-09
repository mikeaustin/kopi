AssignmentPattern
  = NextRule

AssignmentTuplePattern
  = head:(":"? NextRule) tail:(_ "," _ ":"? NextRule)* {
      return tail.length === 0 ? head[1] : new TuplePattern({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[4]
        ], [head[1]])
      });
    }

AssignmentPrimaryPattern
  = _ "(" pattern:AssignmentPattern ")" { return pattern; }
  / NumericLiteralPattern
  / StringLiteralPattern
  / AssignmentIdentifierPattern

AssignmentIdentifierPattern
  = ident:Identifier {
      return new IdentifierPattern({ name: ident.name });
    }

Pattern
  = pattern:NextRule predicate:(_ "[" _ EqualityExpression _ "]" _)? {
      pattern.predicate = predicate?.[3];
      return pattern;
    }

TuplePattern
  = head:(":"? NextRule) tail:(_ "," _ ":"? NextRule)* {
      return tail.length === 0 ? head[1] : new TuplePattern({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[4]
        ], [head[1]])
      });
    }

PrimaryPattern
  = _ "(" pattern:Pattern ")" { return pattern; }
  / NumericLiteralPattern
  / StringLiteralPattern
  / IdentifierPattern

NumericLiteralPattern
  = number:NumericLiteral {
      return new NumericLiteralPattern({ value: number.value });
    }

StringLiteralPattern
  = string:StringLiteral {
      return new StringLiteralPattern({ value: string.value });
    }

IdentifierPattern
  = ident:Identifier init:(_ "=" _ PrimaryExpression)? {
      return new IdentifierPattern({ name: ident.name, init: init && init[3] });
    }
