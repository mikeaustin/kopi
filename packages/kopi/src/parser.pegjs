{
  class Node {
    constructor(args) {
      Object.assign(this, args);
    }
  }

  class Block extends Node { }
  class TypeAssignment extends Node { }
  class Assignment extends Node { }

  class TupleTypeExpression extends Node { }
  class TypeApplyExpression extends Node { }

  class PipeExpression extends Node { }
  class OperatorExpression extends Node { }
  class FunctionExpression extends Node { }
  class ApplyExpression extends Node {
    toString() {
      return `'(${this.expr.name} ${this.args})`;
    }

    async apply(thisArg, [func, scope, visitors]) {
      return func[this.expr.name].apply(func, [
        await visitors.visitNode(this.args, scope, visitors),
        scope,
        visitors,
      ]);
    }
  }
  class TupleExpression extends Node { }
  class ArrayExpression extends Node { }
  class DictExpression extends Node { }
  class RangeExpression extends Node { }
  class MemberExpression extends Node { }

  class NumericLiteral extends Node {
    toStringAsync() {
      return `${this.value}`;
    }
  }

  class StringLiteral extends Node { }
  class AstLiteral extends Node { }
  class Typename extends Node { }
  class Identifier extends Node {
    toStringAsync() {
      return `'${this.name}`;
    }

    async apply(thisArg, [value]) {
      const evaluatedValue = await value;

      return evaluatedValue[this.name].apply(evaluatedValue, []);
    }
  }

  class TuplePattern extends Node { }
  class NumericLiteralPattern extends Node { }
  class StringLiteralPattern extends Node { }
  class ConstructorPattern extends Node { }
  class FunctionPattern extends Node { }
  class BooleanLiteralPattern extends Node { }
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
  = TypeAssignment
  / Assignment
  / Expression


TypeAssignment
  = pattern:Typename _ "=" _ expr:TypeExpression {
      return new TypeAssignment({ pattern, expr });
    }

TypeExpression
  = TypeApplyExpression

TypeApplyExpression
  = expr:TupleTypeExpression args:(_ TupleTypeExpression)* {
      return args.reduce((expr, [, args]) => (
        new TypeApplyExpression({ expr, args })
      ), expr)
    }

TupleTypeExpression
  = "(" _ head:((Identifier ":") _ Typename) tail:(_ "," _ (Identifier ":") _ Typename)* _ ")" {
      return new TupleTypeExpression({
        elements: tail.reduce((elements, [, , , , , element]) => [
          ...elements,
          element
        ], [head[2]]),
        fields: [],
       });
    }
  / Identifier


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
  = expr:FunctionExpression args:(_ FunctionExpression)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
    }
  / expr:("+" / "-" / "*" / "/" / "%") args:(_ FunctionExpression)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), new Identifier({ name: expr }));
    }

NoFunctionApplyExpression
  = expr:TupleExpression args:(_ TupleExpression)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
    }
  / expr:("+" / "-" / "*" / "/" / "%") args:(_ TupleExpression)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), new Identifier({ name: '+' }));
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
  / TupleExpression

TupleExpression
  = "()" {
    return new TupleExpression({ elements: [] });
  }
  / headName:((Identifier ":") _ NewlineTupleExpression)
    tailNames:(_ "," _ (Identifier ":") _ NewlineTupleExpression)* {
      return tailNames.length === 0 ? headName[2] : new TupleExpression({
        elements: tailNames.reduce((expressions, [, , , , , expression]) => [
          ...expressions,
          expression
        ], [headName[2]]),
        fields: tailNames.reduce((fields, [, , , [field]]) => [
          ...fields,
          field.name
        ], [headName[0][0].name])
      });
    }
  / head:NewlineTupleExpression
    tail:(_ "," _ !(Identifier ":") _ NewlineTupleExpression)*
    tailNames:(_ "," _ (Identifier ":") _ NewlineTupleExpression)* {
  	  return [...tail, ...tailNames].length === 0 ? head : new TupleExpression({
        elements: [
          ...tail.reduce((expressions, [, , , , , expression]) => [
            ...expressions,
            expression
          ], [head]),
          ...tailNames.reduce((expressions, [, , , , , expression]) => [
            ...expressions,
            expression
          ], []),
        ],
        fields: [
          ...tail.reduce((fields, _) => [
            ...fields,
            null,
          ], [null]),
          ...tailNames.reduce((fields, [, , , [field]]) => [
            ...fields,
            field.name,
          ], []),
        ]
      });
    }

NewlineTupleExpression
  = "("
      _ exprsNames:(Newline+ _ (Identifier ":") _ Expression)+ Newline+ _
    ")" {
      return new TupleExpression({
        elements: [
          ...exprsNames.map(expr => expr[4])
        ],
        fields: exprsNames.map(expr => expr[2][0].name)
      });
    }
  / "("
       _ exprs:(Newline+ _ !(Identifier ":") _ Expression)+
       exprsNames:(Newline+ _ (Identifier ":") _ Expression)* Newline+ _
    ")" {
      if (exprs.length === 1 && exprsNames.length === 0) {
        return exprs[0][4];
      }

      return new TupleExpression({
        elements: [
          ...exprs.map(expr => expr[4]),
          ...exprsNames.map(expr => expr[4])
        ],
        fields: [
          ...exprs.map(_ => null),
          ...exprsNames.map(expr => expr[2][0].name)
        ],
      });
    }
  / ArrayExpression

ArrayExpression
  = "[" _ head:OperatorExpression tail:(_ "," _ OperatorExpression)* _ "]" {
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
      return new ArrayExpression({ elements: exprs.map(expr => expr[1]) });
    }
  / DictExpression

DictExpression
  = "{" _ head:(PrimaryExpression ":" _ PrimaryExpression) tail:(_ "," _ PrimaryExpression ":" _ PrimaryExpression)* _ "}" {
    return new DictExpression({
      entries: tail.reduce((entries, [, , , key, , , value]) => [
        ...entries,
        [key.value, value]
      ], [[head[0].value, head[3]]])
    });
  }
  / OperatorExpression

//
// Operators
//

OperatorExpression
  = EqualityExpression

EqualityExpression
  = head:AddExpression tail:(_ ("==" / "!=" / "<=" / ">=" / "<" / ">") _ AddExpression)* {
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
  = head:RangeExpression tail:(_ ("*" / "/" / "%") _ RangeExpression)* {
      return tail.reduce((left, [, op, , right]) => (
        new OperatorExpression({ op, left, right })
      ), head);
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
  = head:(":"? AssignmentPrimaryPattern) tail:(_ "," _ ":"? AssignmentPrimaryPattern)+ {
      return new TuplePattern({
        elements: tail.reduce((elements, [, , , , element]) => [
          ...elements,
          element
        ], [head[1]]),
        fields: tail.reduce((fields, [, , , colon, field]) => [
          ...fields,
          colon && field.name
        ], [head[0] && head[1].name])
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
  = pattern:TuplePattern predicate:(_ "[" _ NoFunctionApplyExpression _ "]")? {
    pattern.predicate = predicate?.[3];

    return pattern;
  }

TuplePattern
  = head:(":"? PrimaryPattern) tail:(_ "," _ ":"? PrimaryPattern)+ {
      return new TuplePattern({
        elements: tail.reduce((elements, [, , , , element]) => [
          ...elements,
          element
        ], [head[1]]),
        fields: tail.reduce((fields, [, , , colon, field]) => [
          ...fields,
          colon && field.name
        ], [head[0] && head[1].name])
      });
    }
  / PrimaryPattern

PrimaryPattern
  = _ "(" pattern:Pattern ")" { return pattern; }
  / NumericLiteralPattern
  / StringLiteralPattern
  // / ConstructorPatern
  / BooleanPattern
  / IdentifierPattern

NumericLiteralPattern
  = number:NumericLiteral {
      return new NumericLiteralPattern({ value: number.value });
    }

StringLiteralPattern
  = string:StringLiteral {
      return new StringLiteralPattern({ value: string.value });
    }

ConstructorPatern
  = ident:Identifier _ pattern:PrimaryPattern {
      return new ConstructorPattern({ name: ident.name, pattern });
    }

BooleanPattern
  = value:("true" / "false") {
    return new BooleanLiteralPattern({ value: value === 'true' ? true : false })
  }

IdentifierPattern
  = ident:Identifier init:(_ "=" _ PrimaryExpression)? {
      return new IdentifierPattern({ name: ident.name, init: init && init[3] });
    }

//
// Literals
//

Typename "typename"
  = _ name:([_A-Z][_a-zA-Z0-9]*) _ { return new Typename({ name: name[0] + name[1].join('') }); }

Identifier "identifier"
  = _ name:([_a-zA-Z][_a-zA-Z0-9]*) _ { return new Identifier({ name: name[0] + name[1].join('') }); }

NumericLiteral "number"
  = _ value:([0-9]+ ("." !"." [0-9]+)?) _ {
    return new NumericLiteral({
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`)
    });
  }

StringLiteral "string"
  = _ "\"" value:[^"]* "\"" _ { return new StringLiteral({ value: value.join('') }); }

AstLiteral "astnode"
  = "'("
      exprs:(Newline+ Expression)+ Newline+
    ")" {
      return new AstLiteral({
        value: new TupleExpression({ elements: exprs.map(expr => expr[1]) })
      });
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
