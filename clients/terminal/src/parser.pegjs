Expression
  = FunctionExpression

FunctionExpression
  = parameterPattern:Pattern _ "=>" _ bodyExpression:Expression {
      return {
        type: "FunctionExpression",
        parameterPattern,
        bodyExpression,
      }
    }
  / AddExpression

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
  = expression:PrimaryExpression _arguments:(_ PrimaryExpression)* {
      return _arguments.reduce((expression, [, argument]) => ({
        type: 'ApplyExpression',
        expression,
        argument,
      }), expression);
    }

//
// PrimaryExpression
//

PrimaryExpression
  = "(" _ head:Expression? tail:(_ "," _ Expression)* _ ")" {
      return head && tail.length === 0 ? head : {
        type: 'TupleExpression',
        elements: !head ? [] : tail.reduce((elements, [, , , expression]) =>
          [...elements, expression], [head]),
      }
    }
  / NumericLiteral
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
  = "(" pattern:Pattern? ")" {
    return pattern ? pattern : {
      type: 'TuplePattern',
      elements: [],
    };
  }
  / IdentifierPattern

IdentifierPattern
  = identifier:Identifier {
    return {
      type: 'IdentifierPattern',
      name: identifier.name,
    }
  }

_ "whitespace"
  = [ \t]*
