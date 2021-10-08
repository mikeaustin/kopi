FunctionExpression
  = "()" _ "=>" _ expr:EqualityExpression {
      return new FunctionExpression({ params: new TuplePattern({
        elements: [],
        fields: []
      }), expr });
    }
  / params:Pattern _ "=>" _ expr:TupleExpression {
      return new FunctionExpression({ params, expr });
    }

ParenthesizedTuple
  = "()" {
      return new TupleExpression({ elements: [] });
    }
  / "("
      tail:(_ Newline+ _ (Identifier ":")? _ Expression)+ Newline+ _
    ")" {
      return tail.length === 1 && tail[0][3] === null ? tail[0][5] : new TupleExpression({
        elements: tail.map(expr => expr[5]),
        fields: tail.map(expr => expr[3] &&  expr[3][0].name)
      });
    }
  / "(" _ expr:Expression _ ")" { return expr; }

ArrayExpression
  = "[]" {
      return new ArrayExpression({ elements: [] });
    }
  / "[" _ head:EqualityExpression tail:(_ "," _ EqualityExpression)* _ "]" {
      return new ArrayExpression({
        elements: tail.reduce((elements, [, , , element]) => [
          ...elements,
          element
        ], [head])
      });
    }
  / "["
       _ exprs:(Newline+ Expression)+ Newline+ _
    "]" {
      return new ArrayExpression({ elements: exprs.map(expr => expr[1]) });
    }
