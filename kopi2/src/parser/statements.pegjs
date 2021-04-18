// --------------------------------------------------------------------------------------------- //
// Core Expressions
// --------------------------------------------------------------------------------------------- //

Statement
  = Assignment
  / Expression

Expression
  = PipeExpression

Assignment
  = pattern:Pattern _ "=" _ expr:Expression {
      return new Assignment({
        _pattern: pattern,
        _expr: expr
      })
    }
