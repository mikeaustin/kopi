const util = require("util");
const fs = require("fs");

const { KopiString, KopiTuple, KopiRange, KopiFunction, KopiDict } = require('../classes');
const {
  TuplePattern,
  ArrayLiteralPattern,
  BooleanLiteralPattern,
  IdentifierPattern,
  NumericLiteralPattern,
  StringLiteralPattern,
  ConstructorPattern,
  FunctionPattern
} = require('../classes');

const { default: Visitors } = require('./Visitors');
const { applyOperator } = require('../utils');

class Interpreter extends Visitors {
  Block({ statements }, scope) {
    const bind = updates => scope = ({ ...scope, ...updates });

    return statements.reduce(async (result, statement) => (
      await result, this.visitNode(statement, scope, bind)
    ), undefined);
  }

  async TypeAssignment({ pattern, expr }, scope, bind) {
    const evaluatedPattern = await this.visitNode(pattern, scope, bind);
    const evaluatedExpr = await this.visitNode(expr, scope, bind);

    bind({
      [evaluatedPattern]: evaluatedExpr
    });
  }

  async Assignment({ pattern, expr }, scope, bind) {
    const evaluatedPattern = await this.visitNode(pattern, scope, bind);
    let matches = null;

    if (pattern.constructor.name === 'FunctionPattern') {
      matches = await evaluatedPattern.getMatches(null, scope, expr);
    } else {
      const evaluatedExpr = await this.visitNode(expr, scope, bind);

      matches = await evaluatedPattern.getMatches(evaluatedExpr, scope);
    }

    // TODO: pass expr directly so FunctionPattern can use it as body
    // const matches = await evaluatedPattern.getMatches(evaluatedExpr, scope, expr);

    Object.entries(matches).forEach(([name, value]) => {
      if (value instanceof KopiFunction) {
        value.closure[name] = value;
      }
    });

    bind(matches);
  }

  TupleTypeExpression({ elements, fields }, scope, bind) {
    return new KopiTuple(
      elements.map(element => this.visitNode(element, scope, bind)),
      fields
    );
  }

  async TypeApplyExpression({ expr, args }, scope, bind) {
    const evaluatedExpr = await this.visitNode(expr, scope, bind);
    const evaluatedArgs = await this.visitNode(args, scope, bind);

    const _Type = class extends KopiTuple {
      constructor(...args) {
        super(...args);
      }
    };

    // Object.defineProperty(_Type, 'name', {
    //   value: 'Hello'
    // });

    const Constructor = (args) => {
      return new _Type(args._elementsArray, args._fieldsArray);
    };
    Constructor.nativeConstructor = _Type;

    return Constructor;
  }

  async PipeExpression({ left, right }, scope, bind) {
    const evaluatedExpr = await this.visitNode(left, scope, bind);
    const evaluatedArgs = await this.visitNode(right.args, scope, bind);

    const extensionMethod = scope.methods.get(evaluatedExpr.constructor)?.[right.name ?? right.expr.name];

    if (extensionMethod) {
      const func = await extensionMethod.apply(undefined, [evaluatedExpr, scope, this, bind]);

      return func.apply(undefined, [evaluatedArgs, scope, this, bind]);
    }

    const value = evaluatedExpr[right.name ?? right.expr.name];

    return typeof value === 'function' || typeof value === 'object' && 'apply' in value
      ? value.apply(evaluatedExpr, [evaluatedArgs, scope, this, bind])
      : value;
  }

  async ApplyExpression({ expr, args }, scope, bind) {
    const evaluatedArgs = await this.visitNode(args, scope, bind);
    const evaluatedExpr = await this.visitNode(expr, scope, bind);

    return evaluatedExpr.apply(undefined, [evaluatedArgs, scope, this, bind]);
  }

  async FunctionExpression({ params, expr }, scope, bind) {
    const evaluatedParams = await this.visitNode(params, scope, bind);
    evaluatedParams.predicate = params.predicate;

    return new KopiFunction(evaluatedParams, expr, scope);
  }

  async TupleExpression({ elements, fields }, scope, bind) {
    if (elements.length === 0) {
      return KopiTuple.empty;
    }

    return new KopiTuple(
      elements.map(element => this.visitNode(element, scope, bind)),
      fields
    );
  }

  ArrayExpression({ elements }, scope, bind) {
    return elements.map(element => this.visitNode(element, scope, bind));
  }

  async DictExpression({ entries }, scope, bind) {
    const evaluatedKeys = await Promise.all(entries.map(async ([key, value]) => (
      await this.visitNode(key, scope, bind)
    )));

    const evaluatedValues = entries.map(([key, value]) => (
      this.visitNode(value, scope, bind)
    ));

    const evaluatedEntries = evaluatedKeys.reduce((evaluatedEntries, evaluatedKey, index) => [
      ...evaluatedEntries,
      [evaluatedKey, evaluatedValues[index]]
    ], []);

    return new KopiDict(evaluatedEntries);
  }

  RangeExpression({ from, to }, scope, bind) {
    return new KopiRange(this.visitNode(from, scope, bind), this.visitNode(to, scope, bind));
  }

  async MemberExpression({ expr, member }, scope, bind) {
    const evaluatedExpr = await this.visitNode(expr, scope, bind);

    return evaluatedExpr[member];
  }

  async OperatorExpression({ op, left, right }, scope, bind) {
    const evaluatedLeft = await this.visitNode(left, scope, bind);
    const evaluatedRight = await this.visitNode(right, scope, bind);

    return applyOperator(op, evaluatedLeft, evaluatedRight, scope, this);
  }

  //

  TuplePattern({ elements, fields }, scope) {
    // console.log('TuplePattern', fields);

    return new TuplePattern(
      elements.map(element => this.visitNode(element, scope)),
      fields
    );
  }

  ArrayLiteralPattern({ elements }, scope) {
    return new ArrayLiteralPattern(
      elements.map(element => this.visitNode(element, scope))
    );
  }

  BooleanLiteralPattern({ value }) {
    return new BooleanLiteralPattern(value);
  }

  NumericLiteralPattern({ value }) {
    return new NumericLiteralPattern(value);
  }

  StringLiteralPattern({ value }) {
    return new StringLiteralPattern(value);
  }

  IdentifierPattern({ name, init }, scope) {
    return new IdentifierPattern(name, init === null ? init : this.visitNode(init, scope));
  }

  ConstructorPattern({ name, pattern }) {
    return new ConstructorPattern(name, pattern);
  }

  async FunctionPattern({ name, params }, scope) {
    const evaluatedParams = this.visitNode(params, scope);

    return new FunctionPattern(name, evaluatedParams);
  }

  //

  NumericLiteral({ value }) {
    return value;
  }

  StringLiteral({ value }) {
    return new KopiString(value);
  }

  BooleanLiteral({ value }) {
    return value;
  }

  AstLiteral({ value }) {
    return value;
  }

  Typename({ name }, scope) {
    return name;
  }

  Identifier({ name }, scope) {
    return scope[name];
  }
}

module.exports = {
  default: new Interpreter(),
};
