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
  class ApplyExpression extends Node {
    apply(thisArg, [func, scope, visitors]) {
      return func[this.expr.name].apply(func, [
        visitors.visitNode(this.args, scope, visitors),
        scope,
        visitors,
      ]);
    }
  }
  class TupleExpression extends Node { }
  class ArrayExpression extends Node { }
  class RangeExpression extends Node { }

  class NumericLiteral extends Node { }
  class StringLiteral extends Node { }
  class AstLiteral extends Node { }
  class Identifier extends Node {
    apply(thisArg, args) {
      return args[0][this.name].apply(args[0], []);
    }
  }

  class TuplePattern extends Node { }
  class NumericLiteralPattern extends Node { }
  class StringLiteralPattern extends Node { }
  class ConstructorPattern extends Node { }
  class FunctionPattern extends Node { }
  class IdentifierPattern extends Node { }
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
  = LowPrecedenceApplyExpression

LowPrecedenceApplyExpression
  = head:PipeExpression tail:(_ "$" _ PipeExpression)* {
      return tail.reduce((expr, [, op, , args]) => (
        new ApplyExpression({ expr, args })
      ), head);
    }

PipeExpression
  = head:ConcatinationExpression tail:(_ "|" _ ConcatinationExpression)* {
      return tail.reduce((left, [, op,, right]) => (
        new PipeExpression({ left, right })
      ), head);
    }

ConcatinationExpression
  = head:ApplyExpression tail:(_ "++" _ Expression)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
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
  / head:ArrayExpression _ tail:("," _ ArrayExpression)+ {
  	  return new TupleExpression({
        elements: tail.reduce((expressions, [, , expression]) => [
          ...expressions,
          expression
        ], [head])
      });
    }
  / "(" _ exprs:(Newline+ Expression)+ Newline+ _ ")" {
    if (exprs.length === 1) {
      return exprs[0][1];
    }

    return new TupleExpression({ elements: exprs.map(expr => expr[1]) });
  }
  / ArrayExpression

  ArrayExpression
    = "[" _ head:AddExpression tail:("," _ AddExpression)* _ "]" {
  	    return new ArrayExpression({
          elements: tail.reduce((elements, [, , element]) => [
            ...elements,
            element
          ], [head])
        });
      }
    / "[" _ exprs:(Newline+ Expression)+ Newline+ _ "]" {
        return new ArrayExpression({ elements: exprs.map(expr => expr[1]) });
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
  / _ "{" _ block:Block _ "}" { return block; }
  / NumericLiteral
  / StringLiteral
  / AstLiteral
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
  / StringLiteralPattern
  // / ConstructorPatern
  / IdentifierPattern

NumericLiteralPattern
  = number:NumericLiteral {
      return new NumericLiteralPattern({ value: number.value });
    }

StringLiteralPattern
  = number:StringLiteral {
      return new StringLiteralPattern({ value: number.value });
    }

ConstructorPatern
  = ident:Identifier _ pattern:PrimaryPattern {
      return new ConstructorPattern({ name: ident.name, pattern });
    }

IdentifierPattern
  = ident:Identifier init:(_ "=" _ PrimaryExpression)? {
      return new IdentifierPattern({ name: ident.name, init: init?.[3] });
    }

//
// Literals
//

Identifier
  = _ name:([_a-zA-Z\*][a-zA-Z0-9]*) _ { return new Identifier({ name: name[0] + name[1].join('') }); }

NumericLiteral "number"
  = _ value:[0-9]+ _ { return new NumericLiteral({ value: Number(value.join('')) }); }

StringLiteral "string"
  = _ "\"" value:[^"]* "\"" _ { return new StringLiteral({ value: value.join('') }); }

AstLiteral
  = "'(" exprs:(Newline+ Expression)+ Newline+ ")" {
    return new AstLiteral({ value: new TupleExpression({ elements: exprs.map(expr => expr[1]) }) });
  }
  / "'" "(" expr:Statement ")" {
      return new AstLiteral({ value: expr });
    }
  / "'" ident:Identifier {
      return new AstLiteral({ value: ident });
    }

//
// Whitespace
//

_
  = Whitespace*

Whitespace "whitespace"
  = [ \t]

Comment "comment"
  = "#" (!Newline .)*

Newline "newline"
  = Comment? [\n\r]
