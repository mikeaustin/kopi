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

  class FunctionPattern extends Node { }
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
  / Comment
  / _ !"end" expr:Expression? {
      return expr
    }

Comment = $
  / "#" chars:(!LineTerminator .)* {
      return '#' + chars.map(([, c]) => c).join("");
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
  / PipeExpression

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

PipeExpression = $
  / head:RelationalExpression tail:(_ "|" _ RelationalExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

RelationalExpression = $
  / head:AddExpression tail:(_ ("<" / ">") _ AddExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

AddExpression = $
  / head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

MultiplyExpression = $
  / head:ApplyExpression tail:(_ ("*" / "/") _ ApplyExpression)* {
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

PrimaryFunctionExpression = $
  / params:Pattern _ "=>" _ "do" _ LineTerminator+ _ statements:Block _ LineTerminator+ _ "end" {
      return new FunctionExpression({
        params: params,
        statements: statements
      })
    }
  / params:Pattern _ "=>" _ expr:RelationalExpression {
      return new FunctionExpression({
        params: params,
        statements: [expr]
      })
    }

PrimaryExpression = $
  / PrimaryFunctionExpression
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
  / FunctionPattern
  / PrimaryPattern

TuplePattern = $
  / head:PrimaryPattern tail:(_ "," _ PrimaryPattern)+ {
    return new TuplePattern({
      elements: tail.reduce((r, e) => [...r, e[3]], [head])
    })
  }

FunctionPattern = $
  / name:Identifier _ args:Pattern _ !"=>" {
      return new FunctionPattern({
        name: name,
        args: args
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
  / StringLiteral

NumericLiteral = $
  / literal:[0-9]+ ("." !"." [0-9]+)? {
      return new Literal({
        value: Number(text())
      })
    }

StringLiteral "string"
  = '"' chars:(!'"' .)* '"' {
      return new Literal({ value: chars.map(([, c]) => c).join("") });
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
