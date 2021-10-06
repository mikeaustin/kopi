{
class Node {
  constructor(args) {
    Object.assign(this, args);
  }
}

class OperatorExpression extends Node { }
class TupleExpression extends Node { }
class FunctionExpression extends Node { }
class ArrayExpression extends Node { }
class ApplyExpression extends Node { }

class TuplePattern extends Node { }
class IdentifierPattern extends Node { }

class NumericLiteral extends Node { }
class Identifier extends Node { }
}

Expression

  = expr:TupleExpression Newline* {
      return expr;
    }

TupleExpression

  = head:AddExpression tail:(_ "," _ AddExpression)+ {
      return new TupleExpression({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[3]
        ], [head])
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

  = expr:PrimaryExpression args:(_ PrimaryExpression)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
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
  / "(" _ expr:Expression _ ")" { return expr; }
  / "[" _ head:AddExpression tail:(_ "," _ AddExpression)* _ "]" {
      return new ArrayExpression({
        elements: tail.reduce((elements, [, , , element]) => [
          ...elements,
          element
        ], [head])
      });
    }
  / NumericLiteral
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

  = ident:Identifier init:(_ "=" _ PrimaryExpression)? {
      return new IdentifierPattern({ name: ident.name, init: init?.[3] });
    }

NumericLiteral

  = _ value:([0-9]+ ("." !"." [0-9]+)?) _ {
    return new NumericLiteral({
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`)
    });
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

Newline

  = [\r?\n]

