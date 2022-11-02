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
  = Expression

Expression
  = PipeExpression

PipeExpression
  = head:AddExpression tail:(_ "|" _ Identifier _ PrimaryExpression? (_ PrimaryExpression)*)* {
      return tail.reduce((expression, [, , , identifier, , argumentExpression, _arguments]) => {
        const foo = {
          type: 'PipeExpression', 
          expression,
          methodName: identifier.name,
          argumentExpression,
        }

        return _arguments.reduce((expression, [, argumentExpression]) => ({
          type: 'ApplyExpression',
          expression,
          argumentExpression,
        }), foo);
      }, head);
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
  = head:ApplyExpression tail:(_ ("*" / "/") _ ApplyExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

ApplyExpression
  = expression:SecondaryExpression _arguments:(_ SecondaryExpression)* {
      return _arguments.reduce((expression, [, argumentExpression]) => ({
        type: 'ApplyExpression',
        expression,
        argumentExpression,
      }), expression);
    }

SecondaryExpression
  = FunctionExpression
  / BlockExpression
  / PrimaryExpression

FunctionExpression
  = parameterPattern:Pattern _ "=>" _ bodyExpression:Expression {
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

//
// PrimaryExpression
//

PrimaryExpression
  = "(" __ head:Expression? tail:(_ (("," __) / __) _ Expression)* __ ")" {
      return head && tail.length === 0 ? head : {
        type: 'TupleExpression',
        expressionElements: !head ? [] : tail.reduce((expressionElements, [, , , expressionElement]) =>
          [...expressionElements, expressionElement], [head]),
      }
    }
  / NumericLiteral
  / StringLiteral
  / AstLiteral
  / Identifier

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

AstLiteral "ast"
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

Newline
  = [\r?\n]
