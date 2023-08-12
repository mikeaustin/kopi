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

    apply(thisArg, [argument, _]) {
      return evaluate(this.expression, {
        ...this.environment,
        [this.parameter.name]: argument
      })
    }
  }

  const operatorFunctions = {
    ['+']: (leftValue, rightValue) => leftValue + rightValue,
    ['-']: (leftValue, rightValue) => leftValue - rightValue,
    ['*']: (leftValue, rightValue) => leftValue * rightValue,
    ['/']: (leftValue, rightValue) => leftValue / rightValue,
  }

  const interpreterVisitors = {
    OperatorExpression: ({ operator, leftExpression, rightExpression }, environment) => {
      const leftValue = evaluate(leftExpression, environment);
      const rightValue = evaluate(rightExpression, environment);

      return operatorFunctions[operator](leftValue, rightValue, environment);
    },

    FunctionApplicationExpression({ expression, argument }, environment) {
      const expressionValue = evaluate(expression, environment);
      const argumentValue = evaluate(argument, environment);

      return expressionValue.apply(undefined, [argumentValue, environment]);
    },

    FunctionExpression({ parameter, bodyExpression }, environment) {
      return new Function(parameter, bodyExpression, environment);
    },

    NumericLiteral: ({ value }) => {
      return value;
    },

    Identifier: ({ name }, environment) => {
      return environment[name];
    }
  }

  function evaluate(astNode, environment) {
    return interpreterVisitors[astNode.type](astNode, environment);
  }
}

Program
  = expression:Expression {
      const environment = {};

      return evaluate(expression, environment);
    }

Expression
  = AddExpression

AddExpression
  = leftExpression:MultiplyExpression _ operator:("+" / "-") _ rightExpression:MultiplyExpression {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / MultiplyExpression

MultiplyExpression
  = leftExpression:FunctionApplicationExpression _ operator:("*" / "/") _ rightExpression:FunctionApplicationExpression {
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
  = "(" _ expression:Expression _ ")" {
    return expression;
  }
  / FunctionExpression
  / NumericLiteral
  / Identifier

FunctionExpression
  = parameter:Identifier _ "=>" _ bodyExpression:Expression {
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
        value: Number(text())
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
