// 2 * (3 + 4)
// 1, 2, 3
// print max 1, 2
// x = print 1, 2 + 3
// map (x => x, x), 5
// a b c
// (x => x * x) 5
// print fold (x => x * x), 5
// (a, b => a + b) 1, 2
// sort "julie" ++ "moronuki"
// xs | reduce 0 sum, x => sum + x
// (a, b => a + b + z) 2, 3

{
  class Node {
    constructor(args) {
      // this.type = this.constructor.name;

      Object.assign(this, args);
    }
  }

  class Block extends Node { }
  class Assignment extends Node { }

  class OperatorExpression extends Node { }
  class FunctionExpression extends Node { }
  class ApplyExpression extends Node { }
  class TupleExpression extends Node { }

  class NumericLiteral extends Node { }
  class Identifier extends Node { }

  class TuplePattern extends Node {
    match(value) {
      return this.elements.reduce((scope, element, index) => ({
        ...scope,
        ...element.match(value.elements[index]),
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
}

//
// Rules
//

Block
  = Newline* head:Statement tail:(Newline+ Statement)* Newline* {
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
  = pattern:Pattern _ "=" _ expr:Expression {
      return new Assignment({ pattern, expr })
    }

Expression
  = ApplyExpression

ApplyExpression
  = expr:PrimaryExpression _ args:Expression {
  	  return new ApplyExpression({ expr, args })
    }
  / FunctionExpression

FunctionExpression
  = params:Pattern _ "=>" _ expr:Expression {
      return new FunctionExpression({ params, expr });
    }
  / TupleExpression

TupleExpression
  = head:AddExpression _ tail:("," _ AddExpression)+ {
  	  return new TupleExpression({
        elements: tail.reduce((expressions, [, , expression]) => [
          ...expressions,
          expression
        ], [head])
      });
    }
  / AddExpression

AddExpression
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)+ {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }
  / MultiplyExpression

MultiplyExpression
  = head:PrimaryExpression tail:(_ ("*" / "/") _ PrimaryExpression)+ {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }
  / PrimaryExpression

PrimaryExpression
  = "(" _ expr:Expression _ ")" { return expr; }
  / NumericLiteral
  / Identifier

//
// Patterns
//

Pattern
  = TuplePattern

TuplePattern
  = head:PrimaryPattern tail:("," _ PrimaryPattern)+ {
      return new TuplePattern({
        elements: tail.reduce((elements, [, , element]) => [...elements, element], [head])
      })
    }
  / PrimaryPattern

IdentifierPattern
  = ident:Identifier {
      return new IdentifierPattern({ name: ident.name });
    }

PrimaryPattern
  = "(" pattern:Pattern ")" { return pattern; }
  / NumericLiteral
  / IdentifierPattern

//
// Literals
//

Identifier
  = name:[a-z][a-zA-Z0-9]* { return new Identifier({ name: text() }); }

NumericLiteral "number"
  = _ [0-9]+ { return new NumericLiteral({ value: Number(text()) }); }

//
// Whitespace
//

_
  = Whitespace*

Whitespace "whitespace"
  = [ \t]

Newline "newline"
  = [\n\r]
