AssignmentPattern
  = NextRule

AssignmentFunctionPattern
  = expr:Identifier _ params:Pattern {
      return new FunctionPattern({
        name: expr.name,
        params: params
      });
    }
  / NextRule

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
  / "()" { return new TuplePattern({ elements: [] }) }
  / ArrayLiteralPattern
  / BooleanLiteralPattern
  / NumericLiteralPattern
  / StringLiteralPattern
  / IdentifierPattern

ArrayLiteralPattern
  = "[]" {
      return new ArrayLiteralPattern({ elements: [] });
    }
  / "[" _ head:PrimaryPattern tail:(_ "," _ PrimaryPattern)* _ "]" {
      return new ArrayLiteralPattern({
        elements: tail.reduce((elements, [, , , element]) => [
          ...elements,
          element
        ], [head])
      });
    }

BooleanLiteralPattern
  = boolean:BooleanLiteral {
      return new BooleanLiteralPattern({ value: boolean.value })
    }

NumericLiteralPattern
  = number:NumericLiteral {
      return new NumericLiteralPattern({ value: number.value });
    }

StringLiteralPattern
  = string:StringLiteral {
      return new StringLiteralPattern({ value: string.value });
    }

IdentifierPattern
  = ident:Identifier init:(_ "=" _ EqualityExpression)? {
      return new IdentifierPattern({ name: ident.name, init: init && init[3] });
    }
