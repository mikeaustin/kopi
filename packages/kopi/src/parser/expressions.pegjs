Expression
  = NextRule

LowPrecedenceApplyExpression
  = head:NextRule tail:(_ "$" _ Newline* _ Expression)* {
      return tail.reduce((expr, [, op, , , , args]) => (
        new ApplyExpression({ expr, args, location: location() })
      ), head);
    }

PipeExpression
  = head:NextRule tail:(_ "|" _ ApplyExpression)* {
      return tail.reduce((left, [, op,, right]) => (
        new PipeExpression({ left, right, location: location() })
      ), head);
    }

TupleExpression
  = head:((Identifier ":")? _ NextRule) tail:(_ "," _ (Identifier ":")? _ NextRule)* {
      return tail.length === 0 && head[0] === null ? head[2] : new TupleExpression({
        fields: tail.reduce((elements, element) => [
          ...elements,
          element[5]
        ], [head[2]]),
        fieldNames: tail.reduce((elements, element) => [
          ...elements,
          element[3] && element[3][0].name
        ], [head[0] && head[0][0].name]),
      });
  }

ApplyExpression
  = expr:NextRule args:(_ NextRule)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args, location: location() })
      ), expr)
    }

RangeExpression
  = from:NextRule _ ".." _ to:NextRule {
      return new RangeExpression({ from, to });
    }
  / from:NextRule _ ".." _ {
      return new RangeExpression({ from, to: new NumericLiteral({ value: +Infinity }) });
    }
  / _ ".." _ to:NextRule {
      return new RangeExpression({ from: new NumericLiteral({ value: -Infinity }), to });
    }
  / NextRule

CalculatedMemberExpression
  = head:NextRule tail:(".(" _ Expression _ ")")* {
      return tail.reduce((expr, [, , args]) => (
        new PipeExpression({
          left: expr,
          right: new ApplyExpression({
            expr: new Identifier({ name: 'get' }),
            args,
            location: location(),
          })
        })
      ), head)
    }

MemberExpression
  = head:NextRule tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((expr, [, ident]) => (
        new MemberExpression({ expr, member: ident?.name ?? ident.value })
      ), head)
    }

PrimaryExpression
  = FunctionExpression
  / ParenthesizedTuple
  / ArrayExpression
  / DictExpression
  / _ "{" _ block:Block _ "}" { return block; }
  / NumericLiteral
  / StringLiteral
  / BooleanLiteral
  / AstLiteral
  / Identifier
