/* eslint-disable no-extend-native */

import * as parser from './lib/parser.js';

import { RawASTNode, ASTNode, Environment, Context, BindValues, KopiTrait, KopiApplicative } from './modules/shared.js';

import * as operators from './modules/operators/index.js';
import * as terminals from './modules/terminals/index.js';

import { KopiValue, Extensions } from './modules/shared.js';
import { KopiArray, KopiElement, KopiNumber, KopiString, KopiSubject, KopiTimer } from './modules/terminals/classes/index.js';

import * as core from './functions/core.js';
import React from 'react';

class KopiChart extends KopiElement {
  // @ts-ignore
  static async inspect() {
    return `Chart`;
  }

  // @ts-ignore
  static apply(thisArg: KopiValue, data: KopiArray) {
    console.log('here');

    return new KopiChart(data);
  }

  data: KopiArray;

  constructor(data: KopiArray) {
    super(React.createElement('svg', { height: 100 }, [
      React.createElement('circle', { cx: 50, cy: 50, r: 50 })
    ]));

    this.data = data;
  }
}

declare global {
  interface FunctionConstructor {
    traits: KopiTrait[];
  }

  interface Function {
    inspect(): Promise<string>;
    get fields(): Promise<KopiValue>[];
    toJS(): Promise<KopiValue>;
    invoke(
      methodName: string,
      [argument, context]: [KopiValue, Context]
    ): Promise<KopiValue>;
  }
}

Function.prototype.inspect = function () {
  return Promise.resolve(`<native-function>`);
};

Function.traits = [KopiApplicative];

//

const environment: {
  [name: string]: KopiValue;
} = {
  x: new KopiNumber(3),

  String: KopiString,
  Number: KopiNumber,
  Chart: KopiChart,

  Observer(value: KopiValue) {
    return new KopiSubject(value);
  },

  print: core.kopi_print,
  sleep: core.kopi_sleep,
  match: core.kopi_match,

  let: core.kopi_let,
  loop: core.kopi_loop,

  type: core.kopi_type,
  enum: core.kopi_enum,
  extend: core.kopi_extend,

  fetch: core.kopi_fetch,

  iterate: core.kopi_iterate,
  context: core.kopi_context,
  spawn: core.kopi_spawn,
  image: core.kopi_image,

  async timer(msec: KopiNumber) {
    return new KopiTimer(msec.value);
  },

  _extensions: new Extensions([[KopiString, {
    capitalize: async function (this: KopiString, tuple: KopiValue) {
      return new KopiString(this.value.toUpperCase());
    }
  }]])
};

const transformAst = (ast: RawASTNode) => {
  return transformAstPipeline(ast);
};

const transformAstPipeline = operators.transformAst(terminals.transformAst(transformAst), transformAst);

const evaluateAst = (ast: ASTNode, environment: Environment, bindValues: BindValues) => {
  return evaluateAstPipeline(ast, environment, bindValues);
};

const evaluateAstPipeline = operators.evaluateAst(terminals.evaluateAst(evaluateAst), evaluateAst);

async function interpret(source: string) {
  var ast = parser.parse(source);

  return evaluateAst(transformAst(ast), environment, () => { });
}

const parse = (source: string) => {
  return transformAst(parser.parse(source));
};

export {
  environment,
  parse,
  transformAst,
  evaluateAst,
  interpret,
};
