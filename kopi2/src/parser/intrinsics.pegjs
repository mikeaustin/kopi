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
  = expr:TupleExpression args:(_ TupleExpression)* {
      return args.reduce((result, [, arg]) => (
        new ApplyExpression({
          _expr: result,
          _args: arg
        })
      ), expr);
    }

TupleExpression
  = head:FunctionExpression tail:(_ "," _ FunctionExpression)* {
      return tail.length === 0 ? head : new TupleExpression({
        _elements: tail.reduce((tuple, [,,, expression]) => [...tuple, expression], [head]),
      })
    }

FunctionExpression
  = pattern:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({
        _params: pattern,
        _body: expr
      })
    }
  / PrimaryExpression

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
