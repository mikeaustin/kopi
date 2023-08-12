//
// Parses syntax into an AST, then interprets it directly.
// Accepts expressions such as "(x => 2 * x) (3 + 4)".
//

{
  class Function {
    constructor(parameter, bodyExpression, environment) {
      this.parameter = parameter;
      this.bodyExpression = bodyExpression;
      this.environment = environment;
    }

    apply(thisArg, [argument]) {
      return evaluate(this.bodyExpression, {
        ...this.environment,
        [this.parameter.name]: argument
      })
    }
  }

  const operators = {
    ['+']: (leftValue, rightValue) => leftValue + rightValue,
    ['-']: (leftValue, rightValue) => leftValue - rightValue,
    ['*']: (leftValue, rightValue) => leftValue * rightValue,
    ['/']: (leftValue, rightValue) => leftValue / rightValue,
  }

  const visitors = {
    Block: ({ statements }, environment) => {
      // const bind = (bindings) => environment = ({ ...environment, ...bindings });

      return statements.reduce((_, expression) => (
        evaluate(expression, environment)
      ), undefined);
    },

    OperatorExpression: ({ operator, leftExpression, rightExpression }, environment) => {
      const leftValue = evaluate(leftExpression, environment);
      const rightValue = evaluate(rightExpression, environment);

      return operators[operator](leftValue, rightValue, environment);
    },

    FunctionApplicationExpression({ expression, argument }, environment) {
      const expressionValue = evaluate(expression, environment);
      const argumentValue = evaluate(argument, environment);

      return expressionValue.apply(undefined, [argumentValue, environment]);
    },

    FunctionExpression({ parameter, bodyExpression }, environment) {
      return new Function(parameter, bodyExpression, environment);
    },

    NumericLiteral: ({ value }, _) => {
      return value;
    },

    Identifier: ({ name }, environment) => {
      return environment[name];
    }
  }

  function evaluate(astNode, environment) {
    console.log(astNode);
    return visitors[astNode.type](astNode, environment);
  }
}

Program
  = block:Block {
      const environment = {};

      return evaluate(block, environment);
    }

Block
  = Newline* head:Expression? tail:(Newline+ Expression)* Newline* {
      return {
        type: 'Block',
        statements: tail.reduce((statements, [, statement]) => (
          [...statements, statement]
        ), [head])
      };
    }

Expression
  = AddExpression

AddExpression
  = leftExpression:MultiplyExpression _
    operator:("+" / "-") _
    rightExpression:MultiplyExpression {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / MultiplyExpression

MultiplyExpression
  = leftExpression:FunctionApplicationExpression _
    operator:("*" / "/") _
    rightExpression:FunctionApplicationExpression {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / FunctionApplicationExpression

FunctionApplicationExpression
  = expression:PrimaryExpression args:(_ PrimaryExpression)* {
      return args.reduce((expression, [, argument]) => ({
        type: 'FunctionApplicationExpression',
        expression,
        argument
      }), expression);
    }

PrimaryExpression
  = "(" expression:AddExpression ")" {
    return expression;
  }
  / FunctionExpression
  / NumericLiteral
  / Identifier

FunctionExpression
  = parameter:Identifier _ "=>" _ bodyExpression:AddExpression {
      return {
        type: 'FunctionExpression',
        parameter,
        bodyExpression
      };
    }

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(value.join(''))
      };
    }

Identifier "identifier"
  = [a-z]+ {
      return {
        type: 'Identifier',
        name: text()
      }
    }

_ "whitespace"
  = [ \t]*

Newline
  = [\r?\n]
