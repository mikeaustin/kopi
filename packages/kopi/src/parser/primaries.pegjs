FunctionExpression
  = "()" _ "=>" _ expr:TupleExpression {
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
      return new ArrayExpression({
        elements: exprs.map(expr => expr[1])
      });
    }

DictExpression
  = "{:}" {
      return new DictExpression({
        entries: []
      });
    }
  / "{" _ head:(PrimaryExpression ":" _ EqualityExpression) tail:(_ "," _ PrimaryExpression ":" _ EqualityExpression)* _ "}" {
      return new DictExpression({
        entries: tail.reduce((entries, [, , , key, , , value]) => [
          ...entries,
          [key, value]
        ], [[head[0], head[3]]])
      });
    }
  / "{"
       _ tail:(Newline+ PrimaryExpression ":" _ Expression)+ Newline+ _
    "}" {
      return new DictExpression({
        entries: tail.map(entry => [entry[1].value, entry[4]])
        });
    }
