{
  class Node {
    constructor(args) {
      Object.assign(this, args)
    }
  }

  class Identifier extends Node { }

  class TupleExpression extends Node { }
  class FunctionExpression extends Node { }
  class ApplyExpression extends Node { }
  class OperatorExpression extends Node { }

  class TuplePattern extends Node { }
}

Block = $
  / LineTerminator* _ head:Statement statements:(_ LineTerminator+ _ Statement)* {
      return statements.reduce((block, [,,, statement]) => (
        statement ? [...block, statement] : block
      ), [head])
    }

Statement = $
  / Comment
  / expr:Expression? {
      return expr
    }

Comment = $
  / "#" chars:(!LineTerminator .)* {
      return '#' + chars.map(([, c]) => c).join("");
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
  / head:TupleExpression tail:(_ "|" _ TupleExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

TupleExpression = $
  / params:Pattern _ "=>" _ expr:TupleExpression {
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
  / head:ApplyExpression tail:(_ ("+" / "-") _ ApplyExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

ApplyExpression = $
  / expr:PrimaryExpression _ args:TupleExpression {
      return new ApplyExpression({
        expr: expr,
        args: args
      })
    }
  / expr:PrimaryExpression {
      return expr
    }

PrimaryFunctionExpression = $
  / params:Pattern _ "=>" _ expr:TupleExpression {
      return new FunctionExpression({
        params: params,
        statements: [expr]
      })
    }

PrimaryExpression = $
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
