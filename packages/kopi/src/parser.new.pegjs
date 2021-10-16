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
class TupleExpression extends Node { }
class FunctionExpression extends Node { }
class ArrayExpression extends Node { }
class ApplyExpression extends Node { }
class DictExpression extends Node { }
class RangeExpression extends Node { }
class MemberExpression extends Node { }

class TuplePattern extends Node { }
class ArrayLiteralPattern extends Node { }
class NumericLiteralPattern extends Node { }
class StringLiteralPattern extends Node { }
class IdentifierPattern extends Node { }

class NumericLiteral extends Node { }
class StringLiteral extends Node { }
class BooleanLiteral extends Node { }
class AstLiteral extends Node { }
class Identifier extends Node {
  async apply(thisArg, [value]) {
    const evaluatedValue = await value;

    return evaluatedValue[this.name].apply(evaluatedValue, []);
  }
}
}

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
  = pattern:AssignmentPattern _ "=" !">" _ expr:Expression {
      return new Assignment({ pattern, expr })
    }

Expression
  = LowPrecedenceApplyExpression

LowPrecedenceApplyExpression
  = head:PipeExpression tail:(_ "$" _ Expression)* {
      return tail.reduce((expr, [, op, , args]) => (
        new ApplyExpression({ expr, args })
      ), head);
    }

PipeExpression
  = head:TupleExpression tail:(_ "|" _ ApplyExpression)* {
      return tail.reduce((left, [, op,, right]) => (
        new PipeExpression({ left, right })
      ), head);
    }

TupleExpression
  = head:((Identifier ":")? _ EqualityExpression) tail:(_ "," _ (Identifier ":")? EqualityExpression)* {
      return tail.length === 0 && head[0] === null ? head[2] : new TupleExpression({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[4]
        ], [head[2]]),
        fields: tail.reduce((elements, element) => [
          ...elements,
          element[3] && element[3][0].name
        ], [head[0] && head[0][0].name]),
      });
  }

EqualityExpression
  = head:ConcatinationExpression tail:(_ ("==" / "!=" / "<=" / ">=" / "<" / ">") _ ConcatinationExpression)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }

ConcatinationExpression
  = head:AddExpression tail:(_ "++" _ Expression)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }

AddExpression
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }

MultiplyExpression
  = head:ApplyExpression tail:(_ ("*" / "/" / "%") _ ApplyExpression)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }

ApplyExpression
  = expr:RangeExpression args:(_ RangeExpression)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
    }

RangeExpression
  = from:MemberExpression _ ".." _ to:MemberExpression {
      return new RangeExpression({ from, to });
    }
  / MemberExpression

MemberExpression
  = head:PrimaryExpression tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((expr, [, ident]) => (
        new MemberExpression({ expr, member: ident?.name ?? ident.value })
      ), head)
    }

PrimaryExpression
  = FunctionExpression
  / ParenthesizedTuple
  / _ "{" _ block:Block _ "}" { return block; }
  / ArrayExpression
  / DictExpression
  / NumericLiteral
  / StringLiteral
  / BooleanLiteral
  / AstLiteral
  / Identifier

AssignmentPattern
  = AssignmentTuplePattern

AssignmentTuplePattern
  = head:(":"? AssignmentPrimaryPattern) tail:(_ "," _ ":"? AssignmentPrimaryPattern)* {
      return tail.length === 0 ? head[1] : new TuplePattern({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[4]
        ], [head[1]])
      });
    }

AssignmentPrimaryPattern
  = _ "(" pattern:AssignmentPattern ")" { return pattern; }
  / NumericLiteralPattern
  / StringLiteralPattern
  / AssignmentIdentifierPattern

AssignmentIdentifierPattern
  = ident:Identifier {
      return new IdentifierPattern({ name: ident.name });
    }

Pattern
  = pattern:TuplePattern predicate:(_ "[" _ EqualityExpression _ "]" _)? {
      pattern.predicate = predicate?.[3];
      return pattern;
    }

TuplePattern
  = head:(":"? PrimaryPattern) tail:(_ "," _ ":"? PrimaryPattern)* {
      return tail.length === 0 ? head[1] : new TuplePattern({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[4]
        ], [head[1]])
      });
    }

PrimaryPattern
  = _ "(" pattern:Pattern ")" { return pattern; }
  / ArrayLiteralPattern
  / NumericLiteralPattern
  / StringLiteralPattern
  / IdentifierPattern

ArrayLiteralPattern
  = "[]" {
      return new ArrayLiteralPattern({ elements: [] });
    }
  / "[" _ head:PrimaryPattern tail:(_ "," _ PrimaryPattern)* _ "]" {
      return new ArrayLiteralPattern({
        elements: tail.reduce((elements, [, , , element]) => [
          ...elements,
          element
        ], [head])
      });
    }

NumericLiteralPattern
  = number:NumericLiteral {
      return new NumericLiteralPattern({ value: number.value });
    }

StringLiteralPattern
  = string:StringLiteral {
      return new StringLiteralPattern({ value: string.value });
    }

IdentifierPattern
  = ident:Identifier init:(_ "=" _ PrimaryExpression)? {
      return new IdentifierPattern({ name: ident.name, init: init && init[3] });
    }

FunctionExpression
  = "()" _ "=>" _ expr:Expression {
      return new FunctionExpression({ params: new TuplePattern({
        elements: [],
        fields: []
      }), expr });
    }
  / params:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({ params, expr });
    }

ParenthesizedTuple
  = "()" {
      return new TupleExpression({ elements: [] });
    }
  / "("
      tail:(_ Newline+ _ (Identifier ":")? _ Expression)+ Newline+ _
    ")" {
      return tail.length === 1 && tail[0][3] === null ? tail[0][5] : new TupleExpression({
        elements: tail.map(expr => expr[5]),
        fields: tail.map(expr => expr[3] &&  expr[3][0].name)
      });
    }
  / "(" _ expr:Expression _ ")" { return expr; }

ArrayExpression
  = "[]" {
      return new ArrayExpression({ elements: [] });
    }
  / "[" _ head:EqualityExpression tail:(_ "," _ EqualityExpression)* _ "]" {
      return new ArrayExpression({
        elements: tail.reduce((elements, [, , , element]) => [
          ...elements,
          element
        ], [head])
      });
    }
  / "["
       _ exprs:(Newline+ Expression)+ Newline+ _
    "]" {
      return new ArrayExpression({
        elements: exprs.map(expr => expr[1])
      });
    }

DictExpression
  = "{:}" {
      return new DictExpression({
        entries: []
      });
    }
  / "{" _ head:(PrimaryExpression ":" _ EqualityExpression) tail:(_ "," _ PrimaryExpression ":" _ EqualityExpression)* _ "}" {
      return new DictExpression({
        entries: tail.reduce((entries, [, , , key, , , value]) => [
          ...entries,
          [key.value, value]
        ], [[head[0].value, head[3]]])
      });
    }
  / "{"
       _ tail:(Newline+ PrimaryExpression ":" _ Expression)+ Newline+ _
    "}" {
      return new DictExpression({
        entries: tail.map(entry => [entry[1].value, entry[4]])
        });
    }

NumericLiteral
  = _ value:([0-9]+ ("." !"." [0-9]+)?) _ {
    return new NumericLiteral({
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`)
    });
  }

StringLiteral
  = _ "\"" value:[^"]* "\"" _ {
      return new StringLiteral({ value: value.join('') });
    }

BooleanLiteral
  = _ value:("true" / "false") _ {
    return new BooleanLiteral({ value: Boolean(value) })
  }

AstLiteral
  = "'("
      exprs:(Newline+ Expression)+ Newline+
    ")" {
      return new AstLiteral({
        value: new TupleExpression({
          elements: exprs.map(expr => expr[1])
        })
      });
    }
  / "'" "(" expr:Statement ")" {
      return new AstLiteral({ value: expr });
    }
  / "'" ident:Identifier {
      return new AstLiteral({ value: ident });
    }

Identifier
  = _ name:([_a-zA-Z][_a-zA-Z0-9]*) _ {
      return new Identifier({
        name: name[0] + name[1].join('')
      });
    }

_
  = Whitespace*

Whitespace
  = [ \t]

Comment
  = "#" (!Newline .)*

Newline
  = Comment? [\r?\n]

