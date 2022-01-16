//
// Parses syntax into an AST, then interprets it directly.
// Accepts multi-line expressions such as:
//   a = 1
//   f = b => (a + b) * 2
//   f 5
//

{
  class Function {
    constructor(parameter, expression, environment) {
      this.parameter = parameter;
      this.expression = expression;
      this.environment = environment;
    }

    apply(thisArg, [argumentValue]) {
      return evaluateNode(this.expression, {
        ...this.environment,
        [this.parameter.name]: argumentValue
      })
    }
  }

  const operatorFunctions = {
    ['+']: (leftValue, rightValue) => leftValue + rightValue,
    ['-']: (leftValue, rightValue) => leftValue - rightValue,
    ['*']: (leftValue, rightValue) => leftValue * rightValue,
    ['/']: (leftValue, rightValue) => leftValue / rightValue
  }

  const interpreterVisitors = {
    Block: ({ statements }, environment) => {
      const bindVariables = (bindings) => environment = ({ ...environment, ...bindings });

      return statements.reduce((_, expression) => (
        evaluateNode(expression, environment, bindVariables)
      ), undefined);
    },

    Assignment: ({ variable, expression }, environment, bindVariables) => {
      bindVariables({
        [variable]: evaluateNode(expression, environment, bindVariables)
      });
    },

    OperatorExpression: ({ operator, leftExpression, rightExpression }, environment) => {
      const leftValue = evaluateNode(leftExpression, environment);
      const rightValue = evaluateNode(rightExpression, environment);

      return operatorFunctions[operator](leftValue, rightValue, environment);
    },

    FunctionApplicationExpression({ expression, argument }, environment) {
      const expressionValue = evaluateNode(expression, environment);
      const argumentValue = evaluateNode(argument, environment);

      return expressionValue.apply(undefined, [argumentValue, environment]);
    },

    FunctionExpression({ parameter, expression }, environment) {
      return new Function(parameter, expression, environment);
    },

    NumericLiteral: ({ value }) => {
      return value;
    },

    Identifier: ({ name }, environment) => {
      return environment[name];
    }
  }

  function evaluateNode(node, environment, bindVariables) {
    return interpreterVisitors[node.type](node, environment, bindVariables);
  }
}

Program
  = Newline* head:Statement? tail:(Newline+ Statement)* Newline* {
      const statements = {
        type: 'Block',
        statements: tail.reduce((statements, [, statement]) => (
          [...statements, statement]
        ), [head])
      };

      const environment = {};

      return evaluateNode(statements, environment);
    }

Statement
  = Assignment
  / Expression

Assignment
  = identifier:Identifier _ "=" _ expression:Expression {
    return {
      type: 'Assignment',
      variable: identifier.name,
      expression: expression
    };
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
        expression: expression,
        argument: argument
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
        parameter: parameter,
        expression: expression
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
