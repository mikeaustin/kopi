const parens = (string) => {
  return `\x1b[37;2m(\x1b[0m${string}\x1b[37;2m)\x1b[0m`;
};

const collect = (values, mapper) => {
  return values.reduce((array, item) => {
    const result = mapper(item);

    return result ? [...array, result] : array;
  }, []);
};

class Visitors {
  visit(node, scope) {
    if (node === null) {
      return { value: undefined };
    }

    if (this[node.constructor.name]) {
      return this[node.constructor.name](node, scope);
    } else {
      throw new Error(`No AST visitor for '${node.constructor.name}'`);
    }
  }
}

class PrintASTVisitors extends Visitors {
  Comment({ value }) {
    return;
    return `# ${value}`;
  }

  Block({ statements }) {
    return collect(statements, statement => this.visit(statement));
  }

  ApplyExpression({ expr, args }) {
    return parens(`${this.visit(expr)} ${this.visit(args)}`);
  }

  TupleExpression({ elements }) {
    return parens(`${elements.map(value => this.visit(value)).join(', ')}`);
  }

  FunctionExpression({ params, statements }) {
    return parens(`${this.visit(this, params)} => ${collect(statements, statement => this.visit(statement))}`);
  }

  OperatorExpression({ op, left, right }) {
    return parens(`${this.visit(left)} ${op} ${this.visit(right)}`);
  }

  TuplePattern({ elements }) {
    return parens(`${elements.map(value => this.visit(value)).join(', ')}`);
  }

  Identifier({ name }) {
    return name;
  }

  Literal({ value }) {
    return typeof value === 'number' ? value : `"${value}"`;
  }
};

module.exports = {
  default: PrintASTVisitors
};
