TypeAssignment
  = pattern:Typename _ "=" _ expr:TypeExpression {
      return new TypeAssignment({ pattern, expr });
    }

TypeExpression
  = NextRule

TypeApplyExpression
  = expr:NextRule args:(_ NextRule)* {
      return args.reduce((expr, [, args]) => (
        new TypeApplyExpression({ expr, args })
      ), expr)
    }

TupleTypeExpression
  = "()" {
      return new TupleTypeExpression({
        elements: [],
        fields: [],
      });
    }
  / "(" _ head:((Identifier ":") _ Typename) tail:(_ "," _ (Identifier ":") _ Typename)* _ ")" {
      return new TupleTypeExpression({
        elements: tail.reduce((elements, [, , , , , element]) => [
          ...elements,
          element
        ], [head[2]]),
        fields: [],
       });
    }
  / Identifier

Typename
  = _ name:([_A-Z][_a-zA-Z0-9]*) _ { return new Typename({ name: name[0] + name[1].join('') }); }
