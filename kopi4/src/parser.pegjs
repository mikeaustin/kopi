{
  class Node {
    constructor(args) {
      Object.assign(this, args);
    }
  }

  class Block extends Node { }
  class Assignment extends Node { }

  class OperatorExpression extends Node { }
  class FunctionExpression extends Node { }
  class ApplyExpression extends Node { }
  class TupleExpression extends Node { }
  class RangeExpression extends Node { }

  class NumericLiteral extends Node { }
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
  = expr:FunctionExpression _ args:(_ FunctionExpression)+ {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
    }
  / FunctionExpression

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
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)+ {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
    }
  / MultiplyExpression

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
  / Identifier

//
// Patterns
//

Pattern
  // = FunctionPattern
  = TuplePattern

TuplePattern
  = head:PrimaryPattern tail:("," _ PrimaryPattern)+ {
      return new TuplePattern({
        elements: tail.reduce((elements, [, , element]) => [...elements, element], [head])
      })
    }
  / PrimaryPattern

NumericLiteralPattern
  = number:NumericLiteral {
      return new NumericLiteralPattern({ value: number.value });
    }

IdentifierPattern
  = ident:Identifier {
      return new IdentifierPattern({ name: ident.name });
    }

FunctionPattern
  = ident:Identifier _ params:Pattern {
      return new FunctionPattern({ name: ident.name, params });
    }

PrimaryPattern
  = _ "(" pattern:Pattern ")" { return pattern; }
  / NumericLiteralPattern
  / IdentifierPattern

//
// Literals
//

Identifier
  = _ [a-z][a-zA-Z0-9]* { return new Identifier({ name: text().trim() }); }

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
