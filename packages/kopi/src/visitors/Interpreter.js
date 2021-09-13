const util = require("util");
const fs = require("fs");

const { KopiString, KopiTuple, KopiRange, KopiFunction } = require('../classes');
const { TuplePattern,
  IdentifierPattern,
  NumericLiteralPattern,
  StringLiteralPattern,
  ConstructorPattern,
  FunctionPattern
} = require('../classes');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

const parserLog = fs.createWriteStream('log/tracer');

class Visitors {
  visitNode(astNode, scope, bind) {
    if (!astNode) {
      return;
    }

    parserLog.write(`${astNode.constructor.name}` + (() => {
      switch (astNode.constructor.name) {
        case 'Identifier': return ` '${astNode.name}'`;
        case 'ApplyExpression': return ` '${astNode.expr.name}'`;
        default: return '';
      }
    })() + '\n');

    if (this[astNode.constructor.name]) {
      return this[astNode.constructor.name](astNode, scope, bind);
    } else {
      throw new Error(`No AST visitor for '${astNode.constructor.name}'`);
    }
  }
}

class Interpreter extends Visitors {
  Block({ statements }, scope) {
    const bind = updates => scope = ({ ...scope, ...updates });

    return statements.reduce(async (result, statement) => (
      await result, this.visitNode(statement, scope, bind)
    ), undefined);
  }

  async Assignment({ pattern, expr }, scope, bind) {
    const evaluatedExpr = await this.visitNode(expr, scope);
    const evaluatedPattern = await this.visitNode(pattern, scope);

    // TODO: pass expr directly so FunctionPattern can use it as body
    const matches = evaluatedPattern.getMatches(evaluatedExpr, scope, expr);

    Object.entries(matches).forEach(([name, value]) => {
      if (value instanceof KopiFunction) {
        value.closure[name] = value;
      }
    });

    bind(matches);
  }

  async PipeExpression({ left, right }, scope) {
    const evaluatedExpr = await this.visitNode(left, scope);
    const evaluatedArgs = await this.visitNode(right.args, scope);

    const value = evaluatedExpr[right.name ?? right.expr.name];

    return typeof value === 'function' || typeof value === 'object' && 'apply' in value
      ? value.apply(evaluatedExpr, [evaluatedArgs, scope, this])
      : value;
  }

  async ApplyExpression({ expr, args }, scope) {
    const evaluatedArgs = await this.visitNode(args, scope);
    const evaluatedExpr = await this.visitNode(expr, scope);

    return evaluatedExpr.apply(undefined, [evaluatedArgs, scope, this]);
  }

  async FunctionExpression({ params, expr }, scope) {
    const evaluatedParams = await this.visitNode(params, scope);

    return new KopiFunction(evaluatedParams, expr, scope);
  }

  async TupleExpression({ elements }, scope) {
    if (elements.length === 0) {
      return KopiTuple.empty;
    }

    return new KopiTuple(
      await Promise.all(elements.map(element => this.visitNode(element, scope)))
    );
  }

  ArrayExpression({ elements }, scope) {
    return Promise.all(elements.map(element => this.visitNode(element, scope)));
  }

  RangeExpression({ from, to }, scope) {
    return new KopiRange(this.visitNode(from, scope), this.visitNode(to, scope));
  }

  async OperatorExpression({ op, left, right }, scope) {
    const evaluatedLeft = await this.visitNode(left, scope);
    const evaluatedRight = await this.visitNode(right, scope);

    if (typeof evaluatedLeft === 'number' && typeof evaluatedRight === 'number') {
      switch (op) {
        case '+': return evaluatedLeft + evaluatedRight;
        case '-': return evaluatedLeft - evaluatedRight;
        case '*': return evaluatedLeft * evaluatedRight;
        case '/': return evaluatedLeft / evaluatedRight;
      }
    }

    return evaluatedLeft[op].apply(evaluatedLeft, [evaluatedRight, scope, this]);
  }

  //

  TuplePattern({ elements }, scope) {
    return new TuplePattern(elements.map(element => this.visitNode(element, scope)));
  }

  IdentifierPattern({ name, init }, scope) {
    return new IdentifierPattern(name, this.visitNode(init, scope));
  }

  NumericLiteralPattern({ value }) {
    return new NumericLiteralPattern(value);
  }

  StringLiteralPattern({ value }) {
    return new StringLiteralPattern(value);
  }

  ConstructorPattern({ name, pattern }) {
    return new ConstructorPattern(name, pattern);
  }

  FunctionPattern({ name, params }, scope) {
    const evaluatedParams = this.visitNode(params, scope);

    return new FunctionPattern(name, evaluatedParams);
  }

  //

  NumericLiteral({ value }) {
    return value;
  }

  StringLiteral({ value }) {
    return value;
  }

  AstLiteral({ value }) {
    return value;
  }

  Identifier({ name }, scope) {
    return scope[name];
  }
}

module.exports = {
  default: new Interpreter(),
};
