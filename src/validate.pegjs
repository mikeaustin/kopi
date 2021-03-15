{
  class Node {
    constructor(args) {
      Object.assign(this, args)
    }
  }

  class Comment extends Node { }
  class Block extends Node { }

  class TupleExpression extends Node { }
  class FunctionExpression extends Node { }
  class ApplyExpression extends Node { }
  class OperatorExpression extends Node { }

  class TuplePattern extends Node { }

  class Literal extends Node { }
  class Identifier extends Node { }
}

Block = $
  / LineTerminator* _ head:Statement statements:(_ LineTerminator+ _ Statement)* {
      return new Block({
        statements: statements.reduce((block, [,,, statement]) => (
          statement ? [...block, statement] : block
        ), [head])
      })
    }

Statement = $
  / Comment
  / expr:Expression? {
      return expr
    }

Comment = $
  / "#" chars:(!LineTerminator .)* {
      return new Comment({ value: chars.map(([, c]) => c).join("").trim() });
    }

Expression = $
  / PipeExpression

FunctionExpression = $
  / params:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({
        params: params,
        statements: [expr]
      })
    }

PipeExpression = $
  / head:ApplyExpression tail:(_ "|" _ ApplyExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

ApplyExpression = $
  / expr:TupleExpression _ args:TupleExpression? {
      return !args ? expr : new ApplyExpression({
        expr: expr,
        args: args
      })
    }

TupleExpression = $
  / params:Pattern _ "=>" _ expr:ApplyExpression {
      return new FunctionExpression({
        params: params,
        statements: [expr]
      })
    }
  / head:AddExpression tail:(_ "," _ AddExpression)* {
      return tail.length === 0 ? head : new TupleExpression({
        elements: tail.reduce((tuple, [,,, expression]) => [...tuple, expression], [head])
      })
    }

AddExpression = $
  / head:PrimaryExpression tail:(_ ("+" / "-") _ PrimaryExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

PrimaryExpression = $
  / Literal
  / Identifier
  / "(" LineTerminator* _ head:Expression? _ LineTerminator* ")" {
      return head ? head : new TupleExpression({
        elements: []
      })
    }

// --------------------------------------------------------------------------------------------- //
// Patterns
// --------------------------------------------------------------------------------------------- //

Pattern = $
  / TuplePattern

TuplePattern = $
  / head:PrimaryPattern tail:(_ "," _ Pattern)* {
      return tail.length === 0 ? head : new TuplePattern({
        elements: tail.reduce((r, e) => [...r, e[3]], [head])
      })
    }

PrimaryPattern = $
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
  // / StringLiteral

NumericLiteral = $
  / literal:[0-9]+ ("." !"." [0-9]+)? {
      return new Literal({
        value: Number(text())
      })
    }

Identifier = $
  / !("of" / "end") name:([a-zA-Z][a-zA-Z0-9]*) {
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
