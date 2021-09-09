ApplyExpression
  = expr:PrimaryExpression args:(_ PrimaryExpression)* {
      return args.reduce((result, [, arg]) => (
        new ApplyExpression({
          expr: result,
          args: arg
        })
      ), expr);
    }

PrimaryExpression
  = Literal
  / Identifier
  / "(" expre:Expression ")" {
    return expr;
  }
