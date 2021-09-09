FieldExpression
  = head:PrimaryExpression tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((result, [, field]) => (
        new FieldExpression({
          expr: result,
          field: field
        })
      ), head);
    }

PrimaryExpression
  = Literal
  / Identifier
  / "'" expr:(Identifier / Literal) {
      return new AstNode({
        _expr: expr
      });
    }
  / "'" "(" _ expr:Statement _ ")" {
      return new AstNode({
        _expr: expr
      });
    }
  / "(" head:Expression? ")" {
      return head ? head : new TupleExpression({
        _elements: [],
        _fields: []
      })
    }
