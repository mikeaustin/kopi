{
  class Node {
    constructor(args) {
      Object.assign(this, args)
    }
  }

  class Block extends Node { }
  class Assignment extends Node { }
  class Literal extends Node { }
  class Identifier extends Node { }
  class TupleExpression extends Node { }
  class FunctionExpression extends Node { }
  class TuplePattern extends Node { }
  class ApplyExpression extends Node { }
}

// --------------------------------------------------------------------------------------------- //
// Top Level
// --------------------------------------------------------------------------------------------- //

Block = $
  / LineTerminator* _ head:Statement statements:(_ LineTerminator+ _ Statement)* {
      return statements.reduce((block, [,,, statement]) => (
        statement ? [...block, statement] : block
      ), [head])
    }

Statement = $
  / Assignment
  / _ !"end" expr:Expression? {
      return expr
    }

Assignment = $
  / pattern:Pattern _ "=" _ expr:Expression {
      return new Assignment({
        pattern: pattern,
        expr: expr
      })
    }

// --------------------------------------------------------------------------------------------- //
// Expressions
// --------------------------------------------------------------------------------------------- //

Expression = $
  / ApplyExpression
  / FunctionExpression
  / TupleExpression
  / PrimaryExpression

ApplyExpression = $
  / expr:PrimaryExpression _ args:Expression {
      return new ApplyExpression({
        expr: expr,
        args: args
      })
    }

FunctionExpression = $
  / params:Pattern _ "=>" _ "do" _ LineTerminator+ _ statements:Block _ LineTerminator+ _ "end" {
      return new FunctionExpression({
        params: params,
        statements: statements
      })
    }
  / params:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({
        params: params,
        statements: [expr]
      })
    }

TupleExpression = $
  / head:PrimaryExpression tail:(_ "," _ PrimaryExpression)+ {
      return new TupleExpression({
        elements: tail.reduce((tuple, [,,, expression]) => [...tuple, expression], [head])
      })
    }

PrimaryExpression = $
  / Literal
  / Identifier
  / "(" head:Expression? ")" {
      return head ? head : new TupleExpression({
        elements: []
      })
    }

// --------------------------------------------------------------------------------------------- //
// Patterns
// --------------------------------------------------------------------------------------------- //

Pattern = $
  / TuplePattern
  / PrimaryPattern

TuplePattern = $
  / head:PrimaryPattern tail:(_ "," _ PrimaryPattern)+ {
    return new TuplePattern({
      elements: tail.reduce((r, e) => [...r, e[3]], [head])
    })
  }

PrimaryPattern = $
  / Literal
  / Identifier
  / "(" head:Pattern? ")" {
      return head ? head : new TuplePattern({
        elements: []
      })
    }

// --------------------------------------------------------------------------------------------- //
// Literals
// --------------------------------------------------------------------------------------------- //

Literal = $
  / NumericLiteral

NumericLiteral = $
  / literal:[0-9]+ ("." !"." [0-9]+)? {
      return new Literal({
        value: Number(text())
      })
    }

Identifier = $
  / name:([a-zA-Z][a-zA-Z0-9]*) {
      return new Identifier({
        name: text()
      })
    }

_ = $
  / WhiteSpace*

WhiteSpace "whitespace" = $
  / " "

LineTerminator = $
  / [\n\r]

$ = "$"
