Expression
  = PrimaryExpression

PrimaryExpression
  = Literal
  / Identifier
  / "(" expre:Expression ")" {
    return expr;
  }
