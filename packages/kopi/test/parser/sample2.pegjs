//
// These rules allow us to parse 1 + 2 with or without spaces
//

AddExpression
  = left:Integer _ "+" _ right:Integer {
      return left + right;
    }

Integer
  = [0-9]+ {
    return Number(text());
  }

_ "whitespace"
  = [ \t]*
