{
  class Node {
    constructor(args) {
      Object.assign(this, args)
    }
  }

  class Comment extends Node { }
  class Assignment extends Node { }
  class Block extends Node { }
  class Ast extends Node { }

  class TupleExpression extends Node { }
  class FunctionExpression extends Node { }
  class ApplyExpression extends Node { }
  class PipeExpression extends Node { }
  class OperatorExpression extends Node { }
  class FieldExpression extends Node { }

  class RangeExpression extends Node { }

  class TuplePattern extends Node {
    match(value) {
      return this.elements.reduce((scope, element, index) => ({
        ...scope,
        ...element.match(value.values[index], scope)
      }), {});
    }
  }

  class IdentifierPattern extends Node {
    match(value) {
      return {
        [this.name]: value
      };
    }
  }

  class Literal extends Node {
    match(value) {
      if (value !== this.value) {
        return { }
        // throw new Error(`Couldn’t match on value ${value}`)
      }

      return {
        [this.value]: value
      }
    }
  }

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
  / Assignment
  / expr:Expression? {
      return expr
    }

Comment = $
  / "#" chars:(!LineTerminator .)* {
      return new Comment({ value: chars.map(([, c]) => c).join("").trim() });
    }

Assignment = $
  / pattern:Pattern _ "=" _ expr:Expression {
      return new Assignment({
        pattern: pattern,
        expr: expr
      })
    }

Expression = $
  / PipeExpression

PipeExpression = $
  / head:ApplyExpression tail:(_ "|" _ ApplyExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new PipeExpression({ op: operator, left: result, right: value })
      }, head);
    }

ApplyExpression = $
  / expr:TupleExpression _ args:(_ TupleExpression)* {
      return args.reduce((result, [, arg]) => (
        new ApplyExpression({
          expr: result,
          args: arg
        })
      ), expr);
    }

TupleExpression = $
  / params:Pattern _ "=>" _ "(" LineTerminator+ block:Block _ ")" LineTerminator+  {
      return new FunctionExpression({
        params: params,
        statements: block.statements
      })
    }
  / params:Pattern _ "=>" _ expr:ApplyExpression {
      return new FunctionExpression({
        params: params,
        statements: [expr]
      })
    }
  / "(" tail:(_ LineTerminator+ _ Expression)* LineTerminator+ ")" {
      return new TupleExpression({
        elements: tail.reduce((tuple, [,,, expression]) => [...tuple, expression], [])
      })
    }
  / head:RangeExpression tail:(_ "," _ RangeExpression)* {
      return tail.length === 0 ? head : new TupleExpression({
        elements: tail.reduce((tuple, [,,, expression]) => [...tuple, expression], [head])
      })
    }

RangeExpression = $
  / from:AddExpression _ ".." _ to:AddExpression {
    return new RangeExpression({ from: from, to: to });
  }
  / expr:AddExpression {
    return expr;
  }

AddExpression = $
  / head:FieldExpression tail:(_ ("++" / "+" / "-") _ FieldExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

FieldExpression = $
  / head:PrimaryExpression tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((result, [, field]) => (
        new FieldExpression({ expr: result, field: field })
      ), head);
    }

PrimaryExpression = $
  / "'" "(" _ expr:Expression _ ")" {
      return new Ast({ expr: expr });
    }
  / "'" expr:Identifier {
      return new Ast({ expr: expr });
    }
  / Literal
  / Identifier
  / "(" _ head:Expression? _ ")" {
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
  / head:PrimaryPattern tail:(_ "," _ PrimaryPattern)* {
      return tail.length === 0 ? head : new TuplePattern({
        elements: tail.reduce((r, e) => [...r, e[3]], [head])
      })
    }

PrimaryPattern = $
  / NumericPattern
  / IdentifierPattern
  / "(" head:Pattern? ")" {
      return head ? head : new TuplePattern({
        elements: []
      })
    }

NumericPattern = $
  / literal:[0-9]+ ("." !"." [0-9]+)? {
      return new Literal({
        value: Number(text())
      })
    }

IdentifierPattern = $
  / name:([a-zA-Z][a-zA-Z0-9]*) {
      return new IdentifierPattern({
        name: text()
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
