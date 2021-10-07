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
class RangeExpression extends Node { }
class MemberExpression extends Node { }

class TuplePattern extends Node { }
class IdentifierPattern extends Node { }

class NumericLiteral extends Node { }
class StringLiteral extends Node { }
class Identifier extends Node { }
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
  = pattern:Pattern _ "=" !">" _ expr:Expression {
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
  = head:TupleExpression tail:(_ "|" _ TupleExpression)* {
      return tail.reduce((left, [, op,, right]) => (
        new PipeExpression({ left, right })
      ), head);
    }

TupleExpression
  = head:((Identifier ":")? _ AddExpression) tail:(_ "," _ (Identifier ":")? AddExpression)+ {
      return new TupleExpression({
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
  / AddExpression

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
  = "()" _ "=>" _ expr:Expression {
      return new FunctionExpression({ params: new TuplePattern({
        elements: [],
        fields: []
      }), expr });
    }
  / params:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({ params, expr });
    }
  / "()" {
    return new TupleExpression({ elements: [] });
  }
  / "(" _ expr:Expression _ ")" { return expr; }
  / "[]" {
    return new ArrayExpression({ elements: [] });
  }
  / "[" _ head:AddExpression tail:(_ "," _ AddExpression)* _ "]" {
      return new ArrayExpression({
        elements: tail.reduce((elements, [, , , element]) => [
          ...elements,
          element
        ], [head])
      });
    }
  / from:Pattern _ ".." _ to:Pattern {
      return new RangeExpression({ from, to });
    }
  / NumericLiteral
  / StringLiteral
  / Identifier

Pattern
  = TuplePattern

TuplePattern
  = head:PrimaryPattern tail:(_ "," _ PrimaryPattern)+ {
      return new TuplePattern({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[3]
        ], [head])
      });
    }
  / PrimaryPattern

PrimaryPattern
  = _ "(" pattern:Pattern ")" { return pattern; }
  / IdentifierPattern

IdentifierPattern
  = ident:Identifier {
      return new IdentifierPattern({ name: ident.name });
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

