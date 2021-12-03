import Visitors from './Visitors.mjs';
import { applyBinaryOperator, applyUnaryOperator } from '../utils.mjs';

import prettyPrinter from './PrettyPrinter.mjs';
import { KopiString, KopiTuple, KopiArray, KopiRange, KopiFunction, KopiDict } from '../classes.mjs';
import {
  TuplePattern,
  ArrayLiteralPattern,
  BooleanLiteralPattern,
  IdentifierPattern,
  NumericLiteralPattern,
  StringLiteralPattern,
  ConstructorPattern,
  FunctionPattern,
} from '../classes.mjs';

import RuntimeError from './RuntimeError.mjs';

class Interpreter extends Visitors {
  async Block({ statements }, scope) {
    const bind = (updates) => scope = ({ ...scope, ...updates });

    globalThis.methods.push(new Map());

    const result = await statements.reduce(async (result, statement) => (
      await result, this.visitNode(statement, scope, bind)
    ), undefined);

    globalThis.methods.pop();

    return result;
  }

  async TypeAssignment({ pattern, expr }, scope, bind) {
    const evaluatedPattern = await this.visitNode(pattern, scope, bind);
    const evaluatedExpr = await this.visitNode(expr, scope, bind);

    Object.defineProperty(evaluatedExpr.nativeConstructor, 'name', {
      value: evaluatedPattern,
    });

    bind({
      [evaluatedPattern]: evaluatedExpr,
    });
  }

  async Assignment({ pattern, expr, location }, scope, bind) {
    try {
      const evaluatedPattern = await this.visitNode(pattern, scope, bind);
      let matches = null;

      if (pattern.constructor.name === 'FunctionPattern') {
        matches = await evaluatedPattern.getMatches(null, scope, expr);
      } else {
        const evaluatedExpr = await this.visitNode(expr, scope, bind);

        matches = await evaluatedPattern.getMatches(evaluatedExpr, scope);
      }

      if (matches === null) {
        throw new RuntimeError(
          'Pattern match failed',
          'file',
          location.start.line,
        );
      }

      // TODO: pass expr directly so FunctionPattern can use it as body
      // const matches = await evaluatedPattern.getMatches(evaluatedExpr, scope, expr);

      Object.entries(matches).forEach(([name, value]) => {
        if (value.incrementReferenceCount) {
          value.incrementReferenceCount();
        }

        if (value instanceof KopiFunction) {
          value.closure[name] = value;
        }
      });

      bind(matches);
    } catch (error) {
      throw new error.constructor(
        `${error.message}\n  in assignment expression '${prettyPrinter.Assignment({ pattern, expr })}'`,
        'file',
        location.start.line,
      );
    }
  }

  TupleTypeExpression({ elements, fields }, scope, bind) {
    return new KopiTuple(
      elements.map((element) => this.visitNode(element, scope, bind)),
      fields,
    );
  }

  async TypeApplyExpression({ expr, args }, scope, bind) {
    // const evaluatedExpr = await this.visitNode(expr, scope, bind);
    // const evaluatedArgs = await this.visitNode(args, scope, bind);

    const _Type = class extends KopiTuple {
      constructor(...args) {
        super(...args);
      }
    };

    const Constructor = (args) => {
      return new _Type(args.getFieldsArray(), args.getFieldNamesArray());
    };
    Constructor.nativeConstructor = _Type;

    return Constructor;
  }

  async PipeExpression({ left, right, location }, scope, bind) {
    const isApplyExpression = right.constructor.name === 'ApplyExpression';

    try {
      const evaluatedExpr = await this.visitNode(left, scope, bind);
      const evaluatedArgs = isApplyExpression
        ? await this.visitNode(right.args, scope, bind)
        : KopiTuple.empty;
      const methodName = isApplyExpression
        ? right.expr.name
        : right.name;

      const extensionMethod = globalThis.methods[globalThis.methods.length - 1].get(evaluatedExpr.constructor)?.[methodName];
      const thisArg = extensionMethod
        ? undefined
        : evaluatedExpr;
      const func = extensionMethod
        ? await extensionMethod.apply(undefined, [evaluatedExpr, scope, this, bind])
        : evaluatedExpr[methodName];

      if (!func) {
        throw new RuntimeError(
          `Method '${methodName}' not found in current scope`,
          'file',
          location.start.line,
        );
      }

      return func.apply(thisArg, [evaluatedArgs, scope, this, bind]);
    } catch (error) {
      throw new error.constructor(
        `${error.message}\n  in pipe expression '${prettyPrinter.PipeExpression({ left, right })}' [Line ${location.start.line}]`,
        'file',
        error.lineNumber,
      );
    }
  }

  async ApplyExpression({ expr, args, location }, scope, bind) {
    try {
      const evaluatedArgs = await this.visitNode(args, scope, bind);
      const evaluatedExpr = await this.visitNode(expr, scope, bind);

      return evaluatedExpr.apply(undefined, [evaluatedArgs, scope, this, bind]);
    } catch (error) {
      throw new error.constructor(
        `${error.message}\n  in apply expression '${prettyPrinter.ApplyExpression({ expr, args })}' [Line ${location?.start?.line}]`,
        'file',
        error.lineNumber,
      );
    }
  }

  async FunctionExpression({ params, expr }, scope, bind) {
    const evaluatedParams = await this.visitNode(params, scope, bind);
    evaluatedParams.predicate = params.predicate;

    return new KopiFunction(evaluatedParams, expr, scope);
  }

  async TupleExpression({ fields, fieldNames }, scope, bind) {
    if (fields.length === 0) {
      return KopiTuple.empty;
    }

    return new KopiTuple(
      fields.map((field) => this.visitNode(field, scope, bind)),
      fieldNames,
    );
  }

  ArrayExpression({ elements }, scope, bind) {
    return new KopiArray(
      elements.map((element) => this.visitNode(element, scope, bind)),
    );
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
      [evaluatedKey, evaluatedValues[index]],
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
    try {
      const evaluatedLeft = await this.visitNode(left, scope, bind);
      const evaluatedRight = await this.visitNode(right, scope, bind);

      return applyBinaryOperator(op, evaluatedLeft, evaluatedRight, scope, this);
    } catch (error) {
      throw new RuntimeError(
        `${error.message}\n  in operator expression '${prettyPrinter.visitNode(left)} ${op} ${prettyPrinter.visitNode(right)}'`,
        'file',
        error.lineNumber,
      );
    }
  }

  async UnaryExpression({ op, right }, scope, bind) {
    const evaluatedRight = await this.visitNode(right, scope, bind);

    const opMethod = op === '-'
      ? 'negate' : op === '!'
        ? 'not' : undefined;

    return applyUnaryOperator(opMethod, evaluatedRight, scope, this);
  }

  async ParenthesesExpression({ expr }, scope, bind) {
    return this.visitNode(expr, scope, bind);
  }

  //

  TuplePattern({ fields, fieldNames }, scope) {
    // console.log('TuplePattern', fields);

    return new TuplePattern(
      fields.map((field) => this.visitNode(field, scope)),
      fieldNames,
    );
  }

  ArrayLiteralPattern({ elements }, scope) {
    return new ArrayLiteralPattern(
      elements.map((element) => this.visitNode(element, scope)),
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

  Identifier({ name, location }, scope) {
    if (!(name in scope)) {
      throw new RuntimeError(
        `Variable '${name}' not found in current scope`,
        'file',
        location.start.line,
      );
    }

    return scope[name];
  }
}

export default new Interpreter();
