FunctionExpression
  = "()" _ "=>" _ expr:Expression {
      return new FunctionExpression({ params: new TuplePattern({
        elements: [],
        fields: []
      }), expr });
    }
  / params:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({ params, expr });
    }

OperatorIdentifier
  = op:("+" / "-" / "*" / "/" / "%" / "<=" / "<" / ">=" / ">") {
      return new Identifier({ name: op })
    }

ParenthesizedTuple
  = "()" {
      return new TupleExpression({ fields: [] });
    }
  / "("
      tail:(_ Newline+ _ ((Identifier / OperatorIdentifier) ":")? _ Expression)+ Newline+ _
    ")" {
      return new ParenthesesExpression({
        expr: tail.length === 1 && tail[0][3] === null ? tail[0][5] : new TupleExpression({
          fields: tail.map(expr => expr[5]),
          fieldNames: tail.map(expr => expr[3] &&  expr[3][0].name),
          multiline: true,
        }),
      });
    }
  / "(" _ expr:Expression _ ")" {
      return new ParenthesesExpression({ expr });
    }

DictExpression
  = "{" _ "}" {
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
       _ tail:(_ Newline+ _ PrimaryExpression ":" _ Expression)+ Newline+ _
    "}" {
      return new DictExpression({
        entries: tail.map(entry => [entry[3], entry[6]])
      });
    }

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
       _ exprs:(_ Newline+ _ Expression)+ Newline+ _
    "]" {
      return new ArrayExpression({
        elements: exprs.map(expr => expr[3])
      });
    }
