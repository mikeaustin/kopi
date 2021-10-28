Block
  = Newline* head:Statement? tail:(Newline+ Statement)* Newline* {
      return new Block({
        statements: tail.reduce((block, [, statement]) => (
          statement ? [...block, statement] : block
        ), [head])
      });
    }

Statement
  = TypeAssignment
  / Assignment
  / Expression

Assignment
  = pattern:AssignmentPattern _ "=" !">" _ expr:Expression {
      return new Assignment({ pattern, expr })
    }
