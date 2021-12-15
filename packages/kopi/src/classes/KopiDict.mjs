import { Map } from 'immutable';

import KopiTuple from './KopiTuple.mjs';

// const { applyBinaryOperator } = require('../utils');

async function applyBinaryOperator(op, left, right, scope, visitors) {
  if (typeof left === 'number' && typeof right === 'number') {
    switch (op) {
      case 'negate': return -right;
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      case '%': return left % right;
      case '==': return left === right;
      case '!=': return left !== right;
      case '<=': return left <= right;
      case '>=': return left >= right;
      case '<': return left < right;
      case '>': return left > right;
    }
  }

  const extensionMethod = globalThis.methodsStack[globalThis.methodsStack.length - 1].get(left.constructor)?.[op];

  if (extensionMethod) {
    const func = await extensionMethod.apply(undefined, [left, scope, visitors]);

    return func.apply(undefined, [right, scope, visitors]);

  }

  if (!left[op]) {
    throw Error(`Operator '${op}' not found on value ${await left.inspectAsync()}`);
  }

  return left[op].apply(left, [right, scope, visitors]);
}

class KopiDict {
  constructor(entries) {
    this._immutableMap = new Map(entries);
  }

  async inspectAsync() {
    if (this._immutableMap.size === 0) {
      return '{}';
    }

    const entries = await Promise.all(
      this._immutableMap.toArray().map(async ([key, value]) => (
        `${key.inspectAsync()}: ${await (await value).inspectAsync()}`
      )),
    );

    return `{ ${entries.join(', ')} }`;
  }

  toStringAsync() {
    return this.inspectAsync();
  }

  async ['=='](that, scope, visitors) {
    if (!(that instanceof KopiDict)) {
      return false;
    }

    if (this._immutableMap.size !== that._immutableMap.size) {
      return false;
    }

    for (const [key, value] of this._immutableMap) {
      const left = await value;
      const right = await that._immutableMap.get(key);

      const result = await applyBinaryOperator('==', left, right, scope, visitors);

      if (!result) {
        return false;
      }
    }

    return true;
  }

  async set(tuple) {
    const [key, value] = [await tuple.getFieldAtIndex(0), tuple.getFieldAtIndex(1)];

    return new KopiDict(this._immutableMap.set(key, value));
  }

  async get(key) {
    const value = await this._immutableMap.get(key.valueOf());

    if (value === undefined) {
      return KopiTuple.empty;
    }

    return value;
  }

  async update(key) {
    return (func, scope, visitors) => {
      const entries = this._immutableMap.update(key, (value) => (
        func.apply(undefined, [value ?? KopiTuple.empty, scope, visitors])),
      );

      return new KopiDict(entries);
    };
  }

  async map(func, scope, visitors) {
    let values = new Map();

    for (let [key, value] of this._immutableMap) {
      const predicatePassed = !(func?.params?.predicate && !await visitors.visitNode(func.params.predicate, {
        ...scope,
        ...await func.params.getMatches(new KopiTuple([key, await value])),
      }));

      if (predicatePassed) {
        values = values.set(
          key,
          func.apply(undefined, [new KopiTuple([key, await value]), scope, visitors]),
        );
      }
    }

    return new KopiDict(values);
  }

  async reduce(init) {
    return async (func, scope, visitors) => {
      let accum = await init;

      for (const [key, value] of this._immutableMap) {
        accum = await func.apply(
          undefined,
          [
            new KopiTuple([
              accum,
              new KopiTuple([key, await value]),
            ]),
            scope,
            visitors,
          ],
        );
      }

      return accum;
    };
  }
}

export default KopiDict;
