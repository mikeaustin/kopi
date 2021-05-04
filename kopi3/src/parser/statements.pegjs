// --------------------------------------------------------------------------------------------- //
// Core Expressions
// --------------------------------------------------------------------------------------------- //

Statement
  = Assignment
  / Expression

Assignment
  = pattern:Pattern _ "=" _ expr:Expression {
      return new Assignment({
        pattern: pattern,
        expr: expr
      })
    }

Expression
  = PrimaryExpression
