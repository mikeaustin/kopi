Expression
  = NextRule

LowPrecedenceApplyExpression
  = head:NextRule tail:(_ "$" _ NextRule)* {
      return tail.reduce((expr, [, op, , args]) => (
        new ApplyExpression({ expr, args })
      ), head);
    }

PipeExpression
  = head:NextRule tail:(_ "|" _ NextRule)* {
      return tail.reduce((left, [, op,, right]) => (
        new PipeExpression({ left, right })
      ), head);
    }

TupleExpression
  = head:((Identifier ":")? _ NextRule) tail:(_ "," _ (Identifier ":")? NextRule)+ {
      return new TupleExpression({
        elements: tail.reduce((elements, element) => [
          ...elements,
          element[4]
        ], [head[2]]),
        fields: tail.reduce((elements, element) => [
          ...elements,
          element[3] && element[3][0].name
        ], [head[0] && head[0][0].name]),
      });
  }
  / NextRule

ApplyExpression
  = expr:NextRule args:(_ NextRule)* {
      return args.reduce((expr, [, args]) => (
        new ApplyExpression({ expr, args })
      ), expr)
    }

RangeExpression
  = from:NextRule _ ".." _ to:NextRule {
      return new RangeExpression({ from, to });
    }
  / NextRule

MemberExpression
  = head:NextRule tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((expr, [, ident]) => (
        new MemberExpression({ expr, member: ident?.name ?? ident.value })
      ), head)
    }

PrimaryExpression
  = FunctionExpression
  / "()" {
      return new TupleExpression({ elements: [] });
    }
  / "("
      _ tail:(Newline+ _ (Identifier ":")? _ Expression)+ Newline+ _
    ")" {
      return new TupleExpression({
        elements: tail.map(expr => expr[4]),
        fields: tail.map(expr => expr[2] &&  expr[2][0].name)
      });
    }
  / "(" _ expr:Expression _ ")" { return expr; }
  / "[]" {
    return new ArrayExpression({ elements: [] });
  }
  / "[" _ head:AddExpression tail:(_ "," _ AddExpression)* _ "]" {
      return new ArrayExpression({
        elements: tail.reduce((elements, [, , , element]) => [
          ...elements,
          element
        ], [head])
      });
    }
  / from:NextRule _ ".." _ to:NextRule {
      return new RangeExpression({ from, to });
    }
  / NumericLiteral
  / StringLiteral
  / Identifier
