Start
  = __ program:Program __ { return program; }

// ----- A.1 Lexical Grammar -----

SourceCharacter
  = .

WhiteSpace "whitespace"
  = "\t"
  / " "

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"

Comment "comment"
  = MultiLineComment
  / SingleLineComment

MultiLineComment
  = "/*" (!"*/" SourceCharacter)* "*/"

MultiLineCommentNoLineTerminator
  = "/*" (!("*/" / LineTerminator) SourceCharacter)* "*/"

SingleLineComment
  = "//" (!LineTerminator SourceCharacter)*

Identifier
  = !ReservedWord name:IdentifierName { return name; }

IdentifierName "identifier"
  = head:IdentifierStart tail:IdentifierPart* {
      return {
        type: "Identifier",
        name: head + tail.join("")
      };
    }

IdentifierStart
  = "$"
  / "_"

IdentifierPart
  = IdentifierStart

ReservedWord
  = Keyword
  / NullLiteral
  / BooleanLiteral

Keyword
  = FunctionToken
  / ReturnToken
  / ThisToken
  / VarToken
  / ConstToken
  / ExportToken
  / ExtendsToken
  / ImportToken

Literal
  = NullLiteral
  / BooleanLiteral
  / NumericLiteral
  / StringLiteral

NullLiteral
  = NullToken { return { type: "Literal", value: null }; }

BooleanLiteral
  = TrueToken  { return { type: "Literal", value: true  }; }
  / FalseToken { return { type: "Literal", value: false }; }

// The "!(IdentifierStart / DecimalDigit)" predicate is not part of the official
// grammar, it comes from text in section 7.8.3.
NumericLiteral "number"
  = literal:HexIntegerLiteral !(IdentifierStart / DecimalDigit) {
      return literal;
    }
  / literal:DecimalLiteral !(IdentifierStart / DecimalDigit) {
      return literal;
    }

DecimalLiteral
  = DecimalIntegerLiteral "." DecimalDigit* ExponentPart? {
      return { type: "Literal", value: parseFloat(text()) };
    }
  / "." DecimalDigit+ ExponentPart? {
      return { type: "Literal", value: parseFloat(text()) };
    }
  / DecimalIntegerLiteral ExponentPart? {
      return { type: "Literal", value: parseFloat(text()) };
    }

DecimalIntegerLiteral
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

ExponentPart
  = ExponentIndicator SignedInteger

ExponentIndicator
  = "e"i

SignedInteger
  = [+-]? DecimalDigit+

HexIntegerLiteral
  = "0x"i digits:$HexDigit+ {
      return { type: "Literal", value: parseInt(digits, 16) };
     }

HexDigit
  = [0-9a-f]i

StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"' {
      return { type: "Literal", value: chars.join("") };
    }
  / "'" chars:SingleStringCharacter* "'" {
      return { type: "Literal", value: chars.join("") };
    }

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation

LineContinuation
  = "\\" LineTerminatorSequence { return ""; }

EscapeSequence
  = CharacterEscapeSequence
  / "0" !DecimalDigit { return "\0"; }
  / HexEscapeSequence

CharacterEscapeSequence
  = SingleEscapeCharacter
  / NonEscapeCharacter

SingleEscapeCharacter
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b"; }
  / "f"  { return "\f"; }
  / "n"  { return "\n"; }
  / "r"  { return "\r"; }
  / "t"  { return "\t"; }
  / "v"  { return "\v"; }

NonEscapeCharacter
  = !(EscapeCharacter / LineTerminator) SourceCharacter { return text(); }

EscapeCharacter
  = SingleEscapeCharacter
  / DecimalDigit
  / "x"
  / "u"

HexEscapeSequence
  = "x" digits:$(HexDigit HexDigit) {
      return String.fromCharCode(parseInt(digits, 16));
    }

// Tokens

ConstToken      = "const"      !IdentifierPart
ExportToken     = "export"     !IdentifierPart
ExtendsToken    = "extends"    !IdentifierPart
FalseToken      = "false"      !IdentifierPart
FunctionToken   = "function"   !IdentifierPart
ImportToken     = "import"     !IdentifierPart
NullToken       = "null"       !IdentifierPart
ReturnToken     = "return"     !IdentifierPart
ThisToken       = "this"       !IdentifierPart
TrueToken       = "true"       !IdentifierPart
VarToken        = "var"        !IdentifierPart

// Skipped

__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

_
  = (WhiteSpace / MultiLineCommentNoLineTerminator)*

// Automatic Semicolon Insertion

EOS
  = __ ";"
  / _ SingleLineComment? LineTerminatorSequence
  / _ &"}"
  / __ EOF

EOF
  = !.

// ----- A.2 Number Conversions -----

// Irrelevant.

// ----- A.3 Expressions -----

PrimaryExpression
  = ThisToken { return { type: "ThisExpression" }; }
  / Identifier
  / Literal
  / ArrayLiteral
  / ObjectLiteral
  / "(" __ expression:Expression __ ")" { return expression; }

ArrayLiteral
  = "[" __ elision:(Elision __)? "]" {
      return {
        type: "ArrayExpression",
        elements: optionalList(extractOptional(elision, 0))
      };
    }
  / "[" __ elements:ElementList __ "]" {
      return {
        type: "ArrayExpression",
        elements: elements
      };
    }
  / "[" __ elements:ElementList __ "," __ elision:(Elision __)? "]" {
      return {
        type: "ArrayExpression",
        elements: elements.concat(optionalList(extractOptional(elision, 0)))
      };
    }

ElementList
  = head:(
      elision:(Elision __)? element:AssignmentExpression {
        return optionalList(extractOptional(elision, 0)).concat(element);
      }
    )
    tail:(
      __ "," __ elision:(Elision __)? element:AssignmentExpression {
        return optionalList(extractOptional(elision, 0)).concat(element);
      }
    )*
    { return Array.prototype.concat.apply(head, tail); }

Elision
  = "," commas:(__ ",")* { return filledArray(commas.length + 1, null); }

ObjectLiteral
  = "{" __ "}" { return { type: "ObjectExpression", properties: [] }; }
  / "{" __ properties:PropertyNameAndValueList __ "}" {
       return { type: "ObjectExpression", properties: properties };
     }
  / "{" __ properties:PropertyNameAndValueList __ "," __ "}" {
       return { type: "ObjectExpression", properties: properties };
     }
PropertyNameAndValueList
  = head:PropertyAssignment tail:(__ "," __ PropertyAssignment)* {
      return buildList(head, tail, 3);
    }

PropertyAssignment
  = key:PropertyName __ ":" __ value:AssignmentExpression {
      return { type: "Property", key: key, value: value, kind: "init" };
    }

PropertyName
  = IdentifierName
  / StringLiteral
  / NumericLiteral

PropertySetParameterList
  = id:Identifier { return [id]; }

MemberExpression
  = head:(
        PrimaryExpression
      / FunctionExpression
    )
    tail:(
        __ "[" __ property:Expression __ "]" {
          return { property: property, computed: true };
        }
      / __ "." __ property:IdentifierName {
          return { property: property, computed: false };
        }
    )*
    {
      return tail.reduce(function(result, element) {
        return {
          type: "MemberExpression",
          object: result,
          property: element.property,
          computed: element.computed
        };
      }, head);
    }

NewExpression
  = MemberExpression

CallExpression
  = head:(
      callee:MemberExpression __ args:Arguments {
        return { type: "CallExpression", callee: callee, arguments: args };
      }
    )
    tail:(
        __ args:Arguments {
          return { type: "CallExpression", arguments: args };
        }
      / __ "[" __ property:Expression __ "]" {
          return {
            type: "MemberExpression",
            property: property,
            computed: true
          };
        }
      / __ "." __ property:IdentifierName {
          return {
            type: "MemberExpression",
            property: property,
            computed: false
          };
        }
    )*
    {
      return tail.reduce(function(result, element) {
        element[TYPES_TO_PROPERTY_NAMES[element.type]] = result;

        return element;
      }, head);
    }

Arguments
  = "(" __ args:(ArgumentList __)? ")" {
      return optionalList(extractOptional(args, 0));
    }

ArgumentList
  = head:AssignmentExpression tail:(__ "," __ AssignmentExpression)* {
      return buildList(head, tail, 3);
    }

LeftHandSideExpression
  = CallExpression
  / NewExpression

PostfixExpression
  = argument:LeftHandSideExpression _ operator:PostfixOperator {
      return {
        type: "UpdateExpression",
        operator: operator,
        argument: argument,
        prefix: false
      };
    }
  / LeftHandSideExpression

PostfixOperator
  = "++"
  / "--"

UnaryExpression
  = PostfixExpression
  / operator:UnaryOperator __ argument:UnaryExpression {
      var type = (operator === "++" || operator === "--")
        ? "UpdateExpression"
        : "UnaryExpression";

      return {
        type: type,
        operator: operator,
        argument: argument,
        prefix: true
      };
    }

UnaryOperator
  = "++"
  / "--"
  / $("+" !"=")
  / $("-" !"=")
  / "~"
  / "!"

MultiplicativeExpression
  = head:UnaryExpression
    tail:(__ MultiplicativeOperator __ UnaryExpression)*
    { return buildBinaryExpression(head, tail); }

MultiplicativeOperator
  = $("*" !"=")
  / $("/" !"=")
  / $("%" !"=")

AdditiveExpression
  = head:MultiplicativeExpression
    tail:(__ AdditiveOperator __ MultiplicativeExpression)*
    { return buildBinaryExpression(head, tail); }

AdditiveOperator
  = $("+" ![+=])
  / $("-" ![-=])

RelationalExpression
  = head:AdditiveExpression
    tail:(__ RelationalOperator __ AdditiveExpression)*
    { return buildBinaryExpression(head, tail); }

RelationalOperator
  = "<="
  / ">="
  / $("<" !"<")
  / $(">" !">")

RelationalExpressionNoIn
  = head:AdditiveExpression
    tail:(__ RelationalOperatorNoIn __ AdditiveExpression)*
    { return buildBinaryExpression(head, tail); }

RelationalOperatorNoIn
  = "<="
  / ">="
  / $("<" !"<")
  / $(">" !">")

EqualityExpression
  = head:RelationalExpression
    tail:(__ EqualityOperator __ RelationalExpression)*
    { return buildBinaryExpression(head, tail); }

EqualityExpressionNoIn
  = head:RelationalExpressionNoIn
    tail:(__ EqualityOperator __ RelationalExpressionNoIn)*
    { return buildBinaryExpression(head, tail); }

EqualityOperator
  = "==="
  / "!=="
  / "=="
  / "!="

LogicalANDExpression
  = head:EqualityExpression
    tail:(__ LogicalANDOperator __ EqualityExpression)*
    { return buildLogicalExpression(head, tail); }

LogicalANDExpressionNoIn
  = head:EqualityExpression
    tail:(__ LogicalANDOperator __ EqualityExpression)*
    { return buildLogicalExpression(head, tail); }

LogicalANDOperator
  = "&&"

LogicalORExpression
  = head:LogicalANDExpression
    tail:(__ LogicalOROperator __ LogicalANDExpression)*
    { return buildLogicalExpression(head, tail); }

LogicalORExpressionNoIn
  = head:LogicalANDExpressionNoIn
    tail:(__ LogicalOROperator __ LogicalANDExpressionNoIn)*
    { return buildLogicalExpression(head, tail); }

LogicalOROperator
  = "||"

ConditionalExpression
  = test:LogicalORExpression __
    "?" __ consequent:AssignmentExpression __
    ":" __ alternate:AssignmentExpression
    {
      return {
        type: "ConditionalExpression",
        test: test,
        consequent: consequent,
        alternate: alternate
      };
    }
  / LogicalORExpression

ConditionalExpressionNoIn
  = test:LogicalORExpressionNoIn __
    "?" __ consequent:AssignmentExpression __
    ":" __ alternate:AssignmentExpressionNoIn
    {
      return {
        type: "ConditionalExpression",
        test: test,
        consequent: consequent,
        alternate: alternate
      };
    }
  / LogicalORExpressionNoIn

AssignmentExpression
  = left:LeftHandSideExpression __
    "=" !"=" __
    right:AssignmentExpression
    {
      return {
        type: "AssignmentExpression",
        operator: "=",
        left: left,
        right: right
      };
    }
  / left:LeftHandSideExpression __
    operator:AssignmentOperator __
    right:AssignmentExpression
    {
      return {
        type: "AssignmentExpression",
        operator: operator,
        left: left,
        right: right
      };
    }
  / ConditionalExpression

AssignmentExpressionNoIn
  = left:LeftHandSideExpression __
    "=" !"=" __
    right:AssignmentExpressionNoIn
    {
      return {
        type: "AssignmentExpression",
        operator: "=",
        left: left,
        right: right
      };
    }
  / left:LeftHandSideExpression __
    operator:AssignmentOperator __
    right:AssignmentExpressionNoIn
    {
      return {
        type: "AssignmentExpression",
        operator: operator,
        left: left,
        right: right
      };
    }
  / ConditionalExpressionNoIn

AssignmentOperator
  = "*="
  / "/="
  / "%="
  / "+="
  / "-="
  / "<<="
  / ">>="
  / ">>>="
  / "&="
  / "^="
  / "|="

Expression
  = head:AssignmentExpression tail:(__ "," __ AssignmentExpression)* {
      return tail.length > 0
        ? { type: "SequenceExpression", expressions: buildList(head, tail, 3) }
        : head;
    }

ExpressionNoIn
  = head:AssignmentExpressionNoIn tail:(__ "," __ AssignmentExpressionNoIn)* {
      return tail.length > 0
        ? { type: "SequenceExpression", expressions: buildList(head, tail, 3) }
        : head;
    }

// ----- A.4 Statements -----

Statement
  = Block
  / VariableStatement
  / EmptyStatement
  / ExpressionStatement

Block
  = "{" __ body:(StatementList __)? "}" {
      return {
        type: "BlockStatement",
        body: optionalList(extractOptional(body, 0))
      };
    }

StatementList
  = head:Statement tail:(__ Statement)* { return buildList(head, tail, 1); }

VariableStatement
  = VarToken __ declarations:VariableDeclarationList EOS {
      return {
        type: "VariableDeclaration",
        declarations: declarations,
        kind: "var"
      };
    }

VariableDeclarationList
  = head:VariableDeclaration tail:(__ "," __ VariableDeclaration)* {
      return buildList(head, tail, 3);
    }

VariableDeclarationListNoIn
  = head:VariableDeclarationNoIn tail:(__ "," __ VariableDeclarationNoIn)* {
      return buildList(head, tail, 3);
    }

VariableDeclaration
  = id:Identifier init:(__ Initialiser)? {
      return {
        type: "VariableDeclarator",
        id: id,
        init: extractOptional(init, 1)
      };
    }

VariableDeclarationNoIn
  = id:Identifier init:(__ InitialiserNoIn)? {
      return {
        type: "VariableDeclarator",
        id: id,
        init: extractOptional(init, 1)
      };
    }

Initialiser
  = "=" !"=" __ expression:AssignmentExpression { return expression; }

InitialiserNoIn
  = "=" !"=" __ expression:AssignmentExpressionNoIn { return expression; }

EmptyStatement
  = ";" { return { type: "EmptyStatement" }; }

ExpressionStatement
  = !("{" / FunctionToken) expression:Expression EOS {
      return {
        type: "ExpressionStatement",
        expression: expression
      };
    }

// ----- A.5 Functions and Programs -----

FunctionDeclaration
  = FunctionToken __ id:Identifier __
    "(" __ params:(FormalParameterList __)? ")" __
    "{" __ body:FunctionBody __ "}"
    {
      return {
        type: "FunctionDeclaration",
        id: id,
        params: optionalList(extractOptional(params, 0)),
        body: body
      };
    }

FunctionExpression
  = FunctionToken __ id:(Identifier __)?
    "(" __ params:(FormalParameterList __)? ")" __
    "{" __ body:FunctionBody __ "}"
    {
      return {
        type: "FunctionExpression",
        id: extractOptional(id, 0),
        params: optionalList(extractOptional(params, 0)),
        body: body
      };
    }

FormalParameterList
  = head:Identifier tail:(__ "," __ Identifier)* {
      return buildList(head, tail, 3);
    }

FunctionBody
  = body:SourceElements? {
      return {
        type: "BlockStatement",
        body: optionalList(body)
      };
    }

Program
  = body:SourceElements? {
      return {
        type: "Program",
        body: optionalList(body)
      };
    }

SourceElements
  = head:SourceElement tail:(__ SourceElement)* {
      return buildList(head, tail, 1);
    }

SourceElement
  = Statement
  / FunctionDeclaration

// ----- A.6 Universal Resource Identifier Character Classes -----

// Irrelevant.

// ----- A.7 Regular Expressions -----

// Irrelevant.

// ----- A.8 JSON -----

// Irrelevant.
