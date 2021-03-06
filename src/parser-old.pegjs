{
  class Node {
    constructor(args) {
      Object.assign(this, args)
    }
  }

  class Block extends Node { }
  class Assignment extends Node { }
  class Literal extends Node { }
  class Identifier extends Node { }

  class RangeExpression extends Node { }
  class ArrayExpression extends Node { }
  class TupleExpression extends Node { }
  class FunctionExpression extends Node { }
  class ApplyExpression extends Node { }
  class OperatorExpression extends Node { }
  class CaseExpression extends Node { }

  class TuplePattern extends Node { }
  class ArrayPattern extends Node { }
  class FunctionPattern extends Node { }
}

// --------------------------------------------------------------------------------------------- //
// Top Level
// --------------------------------------------------------------------------------------------- //

Block = $
  / LineTerminator* _ head:Statement statements:(_ LineTerminator+ _ Statement)* {
      return statements.reduce((block, [,,, statement]) => (
        statement ? [...block, statement] : block
      ), [head])
    }

Statement = $
  / Comment
  / Assignment
  / _ !"end" expr:Expression? {
      return expr
    }

Comment = $
  / "#" chars:(!LineTerminator .)* {
      return '#' + chars.map(([, c]) => c).join("");
    }

Assignment = $
  / pattern:AssignmentPattern _ "=" _ expr:Expression {
      return new Assignment({
        pattern: pattern,
        expr: expr
      })
    }

// --------------------------------------------------------------------------------------------- //
// Expressions
// --------------------------------------------------------------------------------------------- //

Expression = $
  / CaseExpression
  / FunctionExpression
  / PipeExpression

CaseExpression = $
  / _ "case" _ expr:Expression _ "of" _ LineTerminator+ _ funcs:Block _ LineTerminator+ _ "end" {
    return new CaseExpression({
      expr: expr,
      funcs: funcs
    })
  }

FunctionExpression = $
  / params:Pattern _ "=>" _ "do" _ LineTerminator+ _ statements:Block _ LineTerminator+ _ "end" {
      return new FunctionExpression({
        params: params,
        statements: statements
      })
    }
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
  / head:RangeExpression tail:(_ "," _ RangeExpression)* {
      if (tail.length > 0) {
        return new TupleExpression({
          elements: tail.reduce((tuple, [,,, expression]) => [...tuple, expression], [head])
        })
      }

      return head;
    }

RangeExpression = $
  / from:RelationalExpression _ ".." _ to:RelationalExpression {
    return new RangeExpression({ from: from, to: to });
  }
  / expr:RelationalExpression {
    return expr;
  }

RelationalExpression = $
  / head:AddExpression tail:(_ ("<=" / "<" / ">" / "=>") _ AddExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

AddExpression = $
  / head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

MultiplyExpression = $
  / head:ApplyExpression tail:(_ ("*" / "/") _ ApplyExpression)* {
      return tail.reduce((result, [, operator,, value]) => {
        return new OperatorExpression({ op: operator, left: result, right: value })
      }, head);
    }

ApplyExpression = $
  / expr:PrimaryExpression _ args:TupleExpression? {
      if (args) {
        return new ApplyExpression({
          expr: expr,
          args: args
        })
      }

      return expr
    }

PrimaryFunctionExpression = $
  / params:Pattern _ "=>" _ "do" _ LineTerminator+ _ statements:Block _ LineTerminator+ _ "end" {
      return new FunctionExpression({
        params: params,
        statements: statements
      })
    }
  / params:Pattern _ "=>" _ expr:RelationalExpression {
      return new FunctionExpression({
        params: params,
        statements: [expr]
      })
    }

PrimaryExpression = $
  / PrimaryFunctionExpression
  / ArrayExpression
  / Literal
  / Operator
  / Identifier
  / "(" head:Expression? ")" {
      return head ? head : new TupleExpression({
        elements: []
      })
    }

ArrayExpression = $
  / "[" _ head:RangeExpression tail:(_ "," _ RangeExpression)* _ "]" {
    return new ArrayExpression({
      elements: tail.reduce((array, element) => [...array, element[3]], [head])
    })
  }
  / "[" _ "]" {
    return new ArrayExpression({
      elements: []
    })
  }

// --------------------------------------------------------------------------------------------- //
// Patterns
// --------------------------------------------------------------------------------------------- //

Pattern = $
  / ArrayPattern
  / TuplePattern
  / PrimaryPattern

PrimitiveArrayPattern = $
  / ArrayPattern
  / PrimaryPattern

AssignmentPattern = $
  / FunctionPattern
  / Pattern

TuplePattern = $
  / head:PrimaryPattern tail:(_ "," _ Pattern)+ {
    return new TuplePattern({
      elements: tail.reduce((r, e) => [...r, e[3]], [head])
    })
  }

ArrayPattern = $
  / "[" _ head:PrimitiveArrayPattern tail:(_ "," _ PrimitiveArrayPattern)* _ "]" {
    return new ArrayPattern({
      elements: tail.reduce((r, element) => [...r, element[3]], [head])
    })
  }

FunctionPattern = $
  / name:Identifier _ args:Pattern _ {
      return new FunctionPattern({
        name: name,
        args: args
      })
    }

PrimaryPattern = $
  / Literal
  / Identifier
  / "(" head:Pattern? ")" {
      return head ? head : new TuplePattern({
        elements: []
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

Operator = $
  / "+" / "-" / "*" / "/"

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
