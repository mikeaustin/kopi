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

PipeExpression
  = head:ConcatenationExpression tail:(_ "|" _ Identifier _ PrimaryExpression? (_ PrimaryExpression)*)* {
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

ConcatenationExpression
  = head:EqualityExpression tail:(_ "++" _ ConcatenationExpression)? {
      return !tail ? head : {
        type: 'OperatorExpression', operator: '++', leftExpression: head, rightExpression: tail[3]
      };
    }

EqualityExpression
  = head:AddExpression tail:(_ ("==" / "!=") _ AddExpression)* {
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
  = from:MemberExpression _ ".." _ to:MemberExpression {
      return {
        type: 'RangeExpression',
        from,
        to
      };
    }
  / MemberExpression

MemberExpression
  = head:UnaryExpression tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((expression, [, member]) => (
        ({
          type: 'MemberExpression',
          expression,
          member: member.name ? member.name : member.value
        })
      ), head)
    }

UnaryExpression
  = PrimaryExpression
  / operator:("-") argumentExpression:UnaryExpression {
      return {
        type: 'UnaryExpression',
        operator,
        argumentExpression,
      };
    }

//
// PrimaryExpression
//

PrimaryExpression
  = "(" __ fieldName:(Identifier ":")? _ head:Expression? tail:(_ (("," __) / __) (Identifier ":")? _ Expression)* __ ")" _ !"=>" {
      return head && !fieldName && tail.length === 0 ? head : {
        type: 'TupleExpression',
        expressionFields: !head ? [] : tail.reduce((expressionFields, [, , , , expressionField]) =>
          [...expressionFields, expressionField], [head]),
        expressionFieldNames: tail.reduce((fieldNames, [, , fieldName]) =>
          [...fieldNames, fieldName && fieldName[0].name], [fieldName && fieldName[0].name]),
      }
    }
  / FunctionExpression
  / NumericLiteral
  / StringLiteral
  / BooleanLiteral
  / ArrayLiteral
  / DictLiteral
  / BlockExpression
  / AstLiteral
  / Identifier

FunctionExpression
  = parameterPattern:Pattern _ "=>" _ bodyExpression:AddExpression {
      return {
        type: "FunctionExpression",
        parameterPattern,
        bodyExpression,
      }
    }

ArrayLiteral
  = "[" __ head:Expression? tail:(_ (("," __) / __) _ Expression)* __ "]" _ !"=>" {
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
  / "{" __ key:PrimaryExpression ":" _ head:Expression tail:(_ (("," __) / __) PrimaryExpression ":" _ Expression)* __ "}" _ !"=>" {
      return {
        type: 'DictLiteral',
        expressionEntries: tail.reduce((expressionEntries, [, , key, , , expressionValue]) =>
          [...expressionEntries, [key, expressionValue]], [[key, head]]),
      }
    }

BlockExpression
  = "{" _ statements:Block _ "}" {
    return statements;
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

BooleanLiteral
  = value:("true" / "false") {
    return {
      type: 'BooleanLiteral',
      value: value === 'true' ? true : false
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
// Pattern
//

AssignmentPattern
  = AssignmentFunctionPattern
  / AssignmentPrimaryPattern

AssignmentFunctionPattern
  = ident:Identifier _ parameterPattern:AssignmentPrimaryPattern {
      return {
        type: 'FunctionPattern',
        name: ident.name,
        parameterPattern,
      };
    }

AssignmentPrimaryPattern
  = "(" head:Pattern? tail:(_ "," _ Pattern)* ")" {
    return head && tail.length === 0 ? head : {
      type: 'TuplePattern',
      patterns: !head ? [] : tail.reduce((patterns, [, , , pattern]) =>
        [...patterns, pattern], [head]),
    }
  }
  / AssignmentIdentifierPattern

AssignmentIdentifierPattern
  = identifier:Identifier {
    return {
      type: 'IdentifierPattern',
      name: identifier.name,
    };
  }

//

Pattern
  = PrimaryPattern

PrimaryPattern
  = "(" head:Pattern? tail:(_ "," _ Pattern)* ")" {
    return head && tail.length === 0 ? head : {
      type: 'TuplePattern',
      patterns: !head ? [] : tail.reduce((patterns, [, , , pattern]) =>
        [...patterns, pattern], [head]),
    }
  }
  / NumericLiteralPattern
  / IdentifierPattern

NumericLiteralPattern
  = number:NumericLiteral {
      return {
        type: 'NumericLiteralPattern',
        value: number.value,
      }
    }
  
IdentifierPattern
  = identifier:Identifier defaultExpression:(_ "=" _ Expression)? {
    return {
      type: 'IdentifierPattern',
      name: identifier.name,
      defaultExpression: defaultExpression && defaultExpression[3],
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
