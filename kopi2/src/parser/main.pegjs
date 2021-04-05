Statement
  = Assignment
  / Expression

Expression
  = ApplyExpression

Assignment
  = pattern:Pattern _ "=" _ expr:Expression {
      return new Assignment({
        pattern: pattern,
        expr: expr
      })
    }

ApplyExpression
  = expr:TupleExpression args:(_ TupleExpression)* {
      return args.reduce((result, [, arg]) => (
        new ApplyExpression({
          expr: result,
          args: arg
        })
      ), expr);
    }

TupleExpression
  = head:(FunctionExpression) tail:(_ "," _ FunctionExpression)* {
      return tail.length === 0 ? head : new TupleExpression({
        elements: tail.reduce((tuple, [,,, expression]) => [...tuple, expression], [head]),
      })
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
