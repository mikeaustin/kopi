{
  class Node {
    constructor(args) {
      Object.assign(this, args)
    }
  }

  class Comment extends Node { }
  class TypeDefinition extends Node { }
  class Assignment extends Node { }
  class Block extends Node { }

  class Ast extends Node { }

  class TypeExpression extends Node { }
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

  class FunctionPattern extends Node {
    match(value, scope, Function) {
      return {
        [this.name]: new Function(scope, this.params, [value])
      }
    }
  }

  class IdentifierPattern extends Node {
    match(value) {
      return {
        [this.name]: value
      };
    }
  }

  class TypenamePattern extends Node {
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
  class Typename extends Node { }
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
  / TypeDefinition
  / Assignment
  / expr:Expression? {
      return expr
    }

Comment = $
  / "#" chars:(!LineTerminator .)* {
      return new Comment({ value: chars.map(([, c]) => c).join("").trim() });
    }

TypeDefinition = $
  / pattern:TypenamePattern _ "=" _ expr:TypeExpression {
    return new TypeDefinition({
      pattern: pattern,
      expr: expr
    })
  }

TypeExpression = $
  / head:IdentifierPattern ":" _ Typename tail:("," _ IdentifierPattern ":" _ Typename)* {
      return tail.reduce((result, [,, identifier,,, typename]) => (
        new TypeExpression({

        })
      ), head)
    }
  / head:Typename {
      return new TypeExpression({

      })
    }

Assignment = $
  / pattern:AssignmentPattern _ "=" _ expr:Expression {
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
  / expr:Typename _ args:(_ TupleExpression)+ {
      return args.reduce((result, [, arg]) => (
        new ApplyExpression({
          expr: result,
          args: arg
        })
      ), expr);
    }
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
  / head:((Identifier ":")? _ RangeExpression) tail:(_ "," _ (Identifier ":")? _ RangeExpression)* {
      return tail.length === 0 ? head[2] : new TupleExpression({
        elements: tail.reduce((tuple, [,,,id ,, expression]) => [...tuple, expression], [head[2]]),
        fields: tail.reduce((tuple, [,,,id ,, expression]) => [...tuple, id && id[0]], [head[0] && head[0][0]])
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
  / head:MultiplyExpression tail:(_ ("++" / "+" / "-") _ MultiplyExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

MultiplyExpression = $
  / head:FieldExpression tail:(_ ("*" / "/") _ FieldExpression)* {
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
  / "'" expr:(Identifier / Typename / Literal) {
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

AssignmentPattern = $
  / FunctionPattern
  / Pattern

Pattern = $
  / TuplePattern

FunctionPattern = $
  / id:Identifier _ params:Pattern _ {
      return new FunctionPattern({
        name: id.name,
        params: params
      })
    }

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
  / name:([a-z][a-zA-Z0-9]*) {
      return new IdentifierPattern({
        name: text()
      })
    }

TypenamePattern = $
  / name:([A-Z][a-zA-Z0-9]*) {
      return new TypenamePattern({
        name: text()
      })
    }

// --------------------------------------------------------------------------------------------- //
// Literals
// --------------------------------------------------------------------------------------------- //

Literal = $
  / NumericLiteral
  / StringLiteral

NumericLiteral "number" = $
  / literal:[0-9]+ ("." !"." [0-9]+)? {
      return new Literal({
        value: Number(text())
      })
    }

StringLiteral "string" = $
  / '"' chars:(!'"' .)* '"' {
      return new Literal({ value: chars.map(([, c]) => c).join("") });
    }

Name = $
  / [a-z][a-zA-Z0-9]* {
      return text();
    }

Identifier "identifier" = $
  / !("of" / "end") name:Name {
      return new Identifier({
        name: name,
      })
    }
  / name:("+" / "-" / "*" / "/") {
      return new Identifier({
        name: text()
      })
  }

Typename "typename" = $
  / name:([A-Z][a-zA-Z0-9]*) {
      return new Typename({
        name: text()
      })
    }

_ = $
  / WhiteSpace*

WhiteSpace "whitespace" = $
  / " "

LineTerminator = "newline" $
  / [\n\r]

$ = "$"
