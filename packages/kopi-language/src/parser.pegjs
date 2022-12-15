Block
  = __ head:Statement? tail:(_ (Newline _)+ Statement)* __ {
      return {
        type: 'BlockExpression',
        statements: tail.reduce(
          (statements, [, , statement]) => [...statements, statement],
          head ? [head] : []
        ),
      };
    }

Statement
  = Assignment
  / Expression

Assignment
  = pattern:AssignmentPattern _ "=" _ expression:Expression {
      return {
        type: 'Assignment',
        pattern,
        expression,
      }
    }

Expression
  = PipeExpression

//
// Expressions
//

PipeExpression
  = head:ConcatExpression tail:(_ "|" _ Identifier _ RangeExpression? (_ RangeExpression)*)* {
      return tail.reduce((expression, [, , , identifier, , argumentExpression, _arguments]) => {
        const pipelineExpression = {
          type: 'PipeExpression',
          expression,
          methodName: identifier.name,
          argumentExpression,
        }

        return _arguments.reduce((expression, [, argumentExpression]) => ({
          type: 'ApplyExpression',
          expression,
          argumentExpression,
        }), pipelineExpression);
      }, head);
    }

ConcatExpression
  = head:EqualityExpression tail:(_ "++" _ ConcatExpression)? {
      return !tail ? head : {
        type: 'OperatorExpression',
        operator: '++',
        leftExpression: head,
        rightExpression: tail[3]
      };
    }

EqualityExpression
  = head:RelationalExpression tail:(_ ("==" / "!=") _ RelationalExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

RelationalExpression
  = head:AddExpression tail:(_ ("<=" / ">=" / "<" / ">") _ AddExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

AddExpression
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

MultiplyExpression
  = head:ApplyExpression tail:(_ ("*" / "/" / "%") _ ApplyExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

ApplyExpression
  = expression:RangeExpression _arguments:(_ RangeExpression)* {
      return _arguments.reduce((expression, [, argumentExpression]) => ({
        type: 'ApplyExpression',
        expression,
        argumentExpression,
      }), expression);
    }

RangeExpression
  = from:CalculatedMemberExpression _ ".." _ to:CalculatedMemberExpression {
      return {
        type: 'RangeExpression',
        from,
        to,
      };
    }
  / CalculatedMemberExpression

CalculatedMemberExpression
  = head:MemberExpression tail:("." & "(" _ PrimaryExpression _)* {
      return tail.reduce((expression, [, , , argumentExpression]) => ({
        type: 'PipeExpression',
        expression,
        methodName: 'get',
        argumentExpression,
        location: location(),
      }), head);
    }

MemberExpression
  = head:UnaryExpression tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((expression, [, member]) => ({
        type: 'MemberExpression',
        expression,
        member: member.name ? member.name : member.value,
      }), head);
    }

UnaryExpression
  = PrimaryExpression
  / operator:("-" / "!") argumentExpression:UnaryExpression {
      return {
        type: 'UnaryExpression',
        operator,
        argumentExpression,
      };
    }

//
// Primaries
//

PrimaryExpression
  = "(" _ ")" _ !"=>" {
      return {
        type: 'TupleExpression',
        expressionFields: [],
        expressionFieldNames: [],
      }
    }
  / "(" __ fieldName:(Identifier ":")? _ head:Expression tail:(_ (","? __) (Identifier ":")? _ Expression)* __ ")" _ !"=>" {
      return !fieldName && tail.length === 0 ? head : {
        type: 'TupleExpression',
        expressionFields: tail.reduce((expressionFields, [, , , , expressionField]) =>
          [...expressionFields, expressionField], [head]),
        expressionFieldNames: tail.reduce((fieldNames, [, , fieldName]) =>
          [...fieldNames, fieldName && fieldName[0].name], [fieldName && fieldName[0].name]),
      }
    }
  / FunctionExpression
  / BlockExpression
  / BooleanLiteral
  / NumericLiteral
  / StringLiteral
  / ArrayLiteral
  / DictLiteral
  / AstLiteral
  / Identifier

FunctionExpression
  = parameterPattern:Pattern _ "=>" __ bodyExpression:ConcatExpression {
      return {
        type: "FunctionExpression",
        parameterPattern,
        bodyExpression,
      }
    }

BlockExpression
  = "{" _ statements:Block _ "}" {
    return statements;
  }

BooleanLiteral
  = value:("true" / "false") {
    return {
      type: 'BooleanLiteral',
      value: value === 'true' ? true : false
    }
  }

NumericLiteral "number"
  = value:([0-9]+ ("." !"." [0-9]+)?) {
    return ({
      type: 'NumericLiteral',
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`),
      location: location(),
    });
  }

StringLiteral "string"
  = _ "\"" value:[^"]* "\"" _ {
    return {
      type: 'StringLiteral',
      value: value.join(''),
      location: location(),
    };
  }

ArrayLiteral
  = "[" __ head:Expression? tail:(_ (","? __) _ Expression)* __ "]" _ !"=>" {
      return {
        type: 'ArrayLiteral',
        expressionElements: !head ? [] : tail.reduce((expressionElements, [, , , expressionElement]) =>
          [...expressionElements, expressionElement], [head]),
      }
    }

DictLiteral
  = "{" _ ":" _ "}" {
      return {
        type: 'DictLiteral',
        expressionEntries: [],
      }
    }
  / "{" __ key:PrimaryExpression ":" _ head:Expression tail:(_ (","? __) PrimaryExpression ":" _ Expression)* __ "}" _ !"=>" {
      return {
        type: 'DictLiteral',
        expressionEntries: tail.reduce((expressionEntries, [, , key, , , expressionValue]) =>
          [...expressionEntries, [key, expressionValue]], [[key, head]]),
      }
    }


AstLiteral "ast-literal"
  = "'" expression:PrimaryExpression {
      return {
        type: 'AstLiteral',
        value: expression,
      };
    }

Identifier "identifier"
  = _ name:([_a-zA-Z][_a-zA-Z0-9]*) _ {
      return ({
        type: 'Identifier',
        name: name[0] + name[1].join('')
      });
    }

//
// Patterns
//

AssignmentPattern
  = AssignmentFunctionPattern
  / PrimaryPattern

AssignmentFunctionPattern
  = ident:Identifier _ parameterPattern:PrimaryPattern {
      return {
        type: 'FunctionPattern',
        name: ident.name,
        parameterPattern,
      };
    }

//

Pattern
  = PatternAssignment
  / PrimaryPattern

PatternAssignment
  = pattern:PrimaryPattern _ "=" _ defaultExpression:Expression {
      return {
        ...pattern,
        defaultExpression,
      }
    }

PrimaryPattern
  = "(" __ head:Pattern? tail:(_ "," _ Pattern)* __ ")" {
    return head && tail.length === 0 ? head : {
      type: 'TupleLiteralPattern',
      patterns: !head ? [] : tail.reduce((patterns, [, , , pattern]) =>
        [...patterns, pattern], [head]),
    }
  }
  / BooleanLiteralPattern
  / NumericLiteralPattern
  / StringLiteralPattern
  / ArrayLiteralPattern
  / IdentifierPattern

BooleanLiteralPattern
  = boolean:BooleanLiteral {
      return {
        type: 'BooleanLiteralPattern',
        value: boolean.value,
      }
    }

NumericLiteralPattern
  = number:NumericLiteral {
      return {
        type: 'NumericLiteralPattern',
        value: number.value,
      }
    }

StringLiteralPattern
  = string:StringLiteral {
      return {
        type: 'StringLiteralPattern',
        value: string.value,
      }
    }

ArrayLiteralPattern
  = "[" _ head:Pattern tail:(_ "," _ Pattern)* _ "]" {
    return {
      type: 'ArrayLiteralPattern',
      patterns: tail.reduce((patterns, [,,, pattern]) => [...patterns, pattern], [head]),
      defaultExpression: null,
    }
  }

IdentifierPattern
  = identifier:Identifier {
    return {
      type: 'IdentifierPattern',
      name: identifier.name,
      defaultExpression: null,
    };
  }

_ "space"
  = " "*

__ "whitespace"
  = (" " / Newline)*

Comment "comment"
  = "#" (!Newline .)*

Newline
  = Comment? [\r?\n]
