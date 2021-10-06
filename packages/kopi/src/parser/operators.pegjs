MultiplyExpression
  = head:NextRule tail:(_ ("*" / "/" / "%") _ NextRule)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }

ApplyExpression
  = expr:NextRule args:(_ NextRule)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
    }

PrimaryExpression
  = "()" _ "=>" _ expr:Expression {
      return new FunctionExpression({ params: new TuplePattern({
        elements: [],
        fields: []
      }), expr });
    }
  / params:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({ params, expr });
    }
  / "(" _ expr:Expression _ ")" { return expr; }
  / "[" _ head:AddExpression tail:(_ "," _ AddExpression)* _ "]" {
      return new ArrayExpression({
        elements: tail.reduce((elements, [, , , element]) => [
          ...elements,
          element
        ], [head])
      });
    }
  / NumericLiteral
  / Identifier
