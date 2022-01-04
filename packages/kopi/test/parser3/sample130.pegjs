//
// Parses syntax into an AST, then interprets it directly.
// Accepts expressions such as "(x => 2 * x) (3 + 4)".
//

{
  class Function {
    constructor(parameter, expression, environment) {
      this.parameter = parameter;
      this.expression = expression;
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
    Assignment: ({ variable, expression }) => {
      return {
        type: 'Assignment',
        variable: variable,
        expression: expression
      }
    },

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

    FunctionExpression({ parameter, expression }, environment) {
      return new Function(parameter, expression, environment);
    },

    NumericLiteral: ({ value }, _) => {
      return value;
    },

    Identifier: ({ name }, environment) => {
      return environment[name];
    }
  }

  function evaluate(node, environment) {
    return interpreterVisitors[node.type](node, environment);
  }
}

Program
  = expression:Statement {
      const environment = {};

      return evaluate(expression, environment);
    }

Statement
  = Assignment
  / Expression

Assignment
  = identifier:Identifier _ "=" _ expression:AddExpression {
    return {
      type: 'Assignment',
      variable: identifier.name,
      expression: expression
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
  = parameter:Identifier _ "=>" _ expression:AddExpression {
      return {
        type: 'FunctionExpression',
        parameter,
        expression
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
      };
    }

_ "whitespace"
  = [ \t]*
