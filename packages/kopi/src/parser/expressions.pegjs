Block
  = Newline* head:Statement? tail:(Newline+ Statement)* Newline* {
      return new Block({
        statements: tail.reduce((block, [, statement]) => (
          statement ? [...block, statement] : block
        ), [head])
      });
    }

Statement
  = Assignment
  / Expression

Assignment
  = pattern:Pattern _ "=" !">" _ expr:Expression {
      return new Assignment({ pattern, expr })
    }

Expression
  = NextRule

TupleExpression
  = head:NextRule tail:(_ "," _ NextRule)+ {
      return new TupleExpression({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[3]
        ], [head])
      });
  }
  / NextRule

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
  / "()" {
    return new TupleExpression({ elements: [] });
  }
  / "(" _ expr:Expression _ ")" { return expr; }
  / "[]" {
    return new ArrayExpression({ elements: [] });
  }
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
