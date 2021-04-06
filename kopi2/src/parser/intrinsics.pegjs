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

TupleExpression
  = head:PrimaryExpression tail:(_ "," _ PrimaryExpression)* {
      return tail.length === 0 ? head : new TupleExpression({
        _elements: tail.reduce((tuple, [,,, expression]) => [...tuple, expression], [head]),
      })
    }

PrimaryExpression
  = Literal
  / Identifier
  / "'" expr:(Identifier / Literal) {
      return new AstNode({
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
