Statement
  = Assignment
  / Expression

Expression
  = ApplyExpression

Assignment
  = pattern:Pattern _ "=" _ expr:Expression {
      return new Assignment({
        _pattern: pattern,
        _expr: expr
      })
    }

ApplyExpression
  = expr:FunctionExpression args:(_ FunctionExpression)* {
      return args.reduce((result, [, arg]) => (
        new ApplyExpression({
          _expr: result,
          _args: arg
        })
      ), expr);
    }

FunctionExpression
  = pattern:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({
        _params: pattern,
        _body: expr
      })
    }
  / TupleExpression

xxxTupleExpression
  = head:RangeExpression tail:(_ "," _ RangeExpression)* {
      return tail.length === 0 ? head : new TupleExpression({
        _elements: tail.reduce((tuple, [,,, expression]) => [...tuple, expression], [head]),
      })
    }

TupleExpression
  = headNames:(Identifier ":" _ RangeExpression) tailNames:(_ "," _ Identifier ":" _ RangeExpression)* {
      return tailNames.length === 0 ? headNames : new TupleExpression({
        _elements: buildList(headNames[3], tailNames, 6),
        _fields: buildList(headNames[0], tailNames, 3)
      });
    }
  / head:RangeExpression tail:(_ "," _ !(Identifier ":") RangeExpression)* tailNames:(_ "," _ Identifier ":" _ RangeExpression)* {
      return [...tail, ...tailNames].length === 0 ? head : new TupleExpression({
        _elements: [...buildList(head, tail, 4), ...buildList(undefined, tailNames, 6)],
        _fields: [...buildList(null, tail, undefined), ...buildList(undefined, tailNames, 4)],
      });
    }

RangeExpression
  = from:FieldExpression _ ".." _ to:FieldExpression {
    return new RangeExpression({ from: from, to: to });
  }
  / FieldExpression

FieldExpression
  = head:PrimaryExpression tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((result, [, field]) => (
        new FieldExpression({ expr: result, field: field })
      ), head);
    }

PrimaryExpression
  = Literal
  / Identifier
  / "'" expr:(Identifier / Literal) {
      return new AstIdentifierNode({
        _expr: expr
      });
    }
  / "'" "(" _ expr:Expression _ ")" {
      return new AstNode({
        _expr: expr
      });
    }
  / "(" head:Expression? ")" {
      return head ? head : new TupleExpression({
        _elements: []
      })
    }
