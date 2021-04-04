Statement
  = Assignment
  / Expression

Expression
  = ApplyExpression

Assignment
  = pattern:Pattern _ "=" _ expr:Expression {
      return new Assignment({
        left: pattern,
        right: expr
      })
    }

ApplyExpression
  = expr:FunctionExpression args:(_ FunctionExpression)* {
      return args.reduce((result, [, arg]) => (
        new ApplyExpression({
          expr: result,
          args: arg
        })
      ), expr);
    }

FunctionExpression
  = pattern:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({
        params: pattern,
        body: expr
      })
    }
  / PrimaryExpression

PrimaryExpression
  = Literal
  / Identifier
  / "(" head:Expression? ")" {
      return head ? head : new TupleExpression({
        elements: []
      })
    }
