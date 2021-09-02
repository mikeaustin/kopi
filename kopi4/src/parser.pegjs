{
  class Node {
    constructor(args) {
      Object.assign(this, args);
    }
  }

  class Block extends Node { }
  class Assignment extends Node { }

  class PipeExpression extends Node { }
  class OperatorExpression extends Node { }
  class FunctionExpression extends Node { }
  class ApplyExpression extends Node { }
  class TupleExpression extends Node { }
  class RangeExpression extends Node { }

  class NumericLiteral extends Node { }
  class StringLiteral extends Node { }
  class Identifier extends Node { }

  class TuplePattern extends Node { }
  class IdentifierPattern extends Node { }
  class NumericLiteralPattern extends Node { }
  class FunctionPattern extends Node { }
}

//
// Rules
//

Block
  = Newline* head:Statement? tail:(Newline+ Statement)* Newline* {
      return new Block({
        statements: tail.reduce((block, [, statement]) => (
          statement ? [...block, statement] : block
        ), [head])
      });
    }

Statement
  = Assignment
  / Expression

Assignment
  = pattern:AssignmentPattern _ "=" _ expr:Expression {
      return new Assignment({ pattern, expr })
    }

Expression
  = PipeExpression

PipeExpression
  = head:ApplyExpression tail:(_ "|" _ ApplyExpression)* {
      return tail.reduce((left, [, op,, right]) => (
        new PipeExpression({ left, right })
      ), head);
    }

ApplyExpression
  = expr:FunctionExpression _ args:(_ FunctionExpression)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
    }

FunctionExpression
  = "()" _ "=>" _ expr:Expression {
      return new FunctionExpression({ params: new TuplePattern({ elements: [] }), expr });
    }
  / params:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({ params, expr });
    }
  / TupleExpression

TupleExpression
  = "()" {
    return new TupleExpression({ elements: [] });
  }
  / head:AddExpression _ tail:("," _ AddExpression)+ {
  	  return new TupleExpression({
        elements: tail.reduce((expressions, [, , expression]) => [
          ...expressions,
          expression
        ], [head])
      });
    }
  / "(" exprs:(Newline+ Expression)+ Newline+ ")" {
    return new TupleExpression({ elements: exprs.map(expr => expr[1]) });
  }
  / AddExpression

//
// Operators
//

AddExpression
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }

MultiplyExpression
  = head:RangeExpression tail:(_ ("*" / "/") _ RangeExpression)+ {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }
  / RangeExpression

RangeExpression
  = from:PrimaryExpression _ ".." _ to:PrimaryExpression {
      return new RangeExpression({ from, to });
    }
  / PrimaryExpression

PrimaryExpression
  = _ "(" _ expr:Expression _ ")" { return expr; }
  / NumericLiteral
  / StringLiteral
  / Identifier

//
// Patterns
//

AssignmentPattern
  = AssignmentTuplePattern

AssignmentTuplePattern
  = head:AssignmentPrimaryPattern tail:("," _ AssignmentPrimaryPattern)+ {
      return new TuplePattern({
        elements: tail.reduce((elements, [, , element]) => [...elements, element], [head])
      });
    }
  / AssignmentPrimaryPattern

AssignmentPrimaryPattern
  = AssignmentFunctionPattern
  / AssignmentNumericLiteralPattern
  / AssignmentIdentifierPattern

AssignmentNumericLiteralPattern
  = number:NumericLiteral {
      return new NumericLiteralPattern({ value: number.value });
    }

AssignmentIdentifierPattern
  = ident:Identifier {
      return new IdentifierPattern({ name: ident.name });
    }

AssignmentFunctionPattern
  = ident:Identifier _ params:AssignmentPattern {
      return new FunctionPattern({ name: ident.name, params });
    }

//

Pattern
  = TuplePattern

TuplePattern
  = head:PrimaryPattern tail:("," _ PrimaryPattern)+ {
      return new TuplePattern({
        elements: tail.reduce((elements, [, , element]) => [...elements, element], [head])
      });
    }
  / PrimaryPattern

PrimaryPattern
  = _ "(" pattern:Pattern ")" { return pattern; }
  / NumericLiteralPattern
  / IdentifierPattern

NumericLiteralPattern
  = number:NumericLiteral {
      return new NumericLiteralPattern({ value: number.value });
    }

IdentifierPattern
  = ident:Identifier init:(_ "=" _ NumericLiteral)? {
      return new IdentifierPattern({ name: ident.name, init: init?.[3] });
    }

//
// Literals
//

Identifier
  = _ name:([a-zA-Z][a-zA-Z0-9]*) _ { return new Identifier({ name: name[0] + name[1].join('') }); }

NumericLiteral "number"
  = _ value:[0-9]+ _ { return new NumericLiteral({ value: Number(value.join('')) }); }

StringLiteral "string"
  = _ "\"" value:[^"]* "\"" _ { return new StringLiteral({ value: value.join('') }); }

//
// Whitespace
//

_
  = (Whitespace / Comment)*

Whitespace "whitespace"
  = [ \t]

Comment "comment"
  = "#" (!Newline .)*

Newline "newline"
  = [\n\r]
