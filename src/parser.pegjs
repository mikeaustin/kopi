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
  class OperatorExpression extends Node { }
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
  / FunctionExpression
  // / TupleExpression
  / PipeExpression

PipeExpression = $
  / head:AddExpression tail:(_ "|" _ AddExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
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

AddExpression
  = head:ApplyExpression tail:(_ ("+" / "-") _ ApplyExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

ApplyExpression = $
  / expr:TupleExpression _ args:TupleExpression? {
      if (args) {
        return new ApplyExpression({
          expr: expr,
          args: args
        })
      }

      return expr
    }

TupleExpression = $
  / head:PrimaryExpression tail:(_ "," _ PrimaryExpression)* {
      if (tail.length > 0) {
        return new TupleExpression({
          elements: tail.reduce((tuple, [,,, expression]) => [...tuple, expression], [head])
        })
      }

      return head
    }

PrimaryExpression = $
  / Literal
  / Identifier
  / FunctionExpression
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
