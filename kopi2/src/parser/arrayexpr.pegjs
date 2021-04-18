ApplyExpressionInArrayExpression
  = expr:FunctionExpressionInArrayExpression args:(_ FunctionExpressionInArrayExpression)* {
      return args.reduce((result, [, arg]) => (
        new ApplyExpression({
          _expr: result,
          _args: arg
        })
      ), expr);
    }

FunctionExpressionInArrayExpression
  = pattern:Pattern _ "=>" _ expr:ApplyExpressionInArrayExpression {
      return new FunctionExpression({
        _params: pattern,
        _body: expr
      })
    }
  / RangeExpression
