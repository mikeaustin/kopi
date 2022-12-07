/* eslint-disable no-extend-native */

import * as parser from './lib/parser';

import { RawASTNode, ASTNode, Environment, Context, BindValues, KopiTrait, KopiApplicative } from './modules/shared';

import * as operators from './modules/operators';
import * as terminals from './modules/terminals';

import { KopiValue, Extensions } from './modules/shared';
import { KopiNumber, KopiString, KopiSubject, KopiTimer } from './modules/terminals/classes';

import * as core from './functions/core';

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

export {
  environment,
  transformAst,
  evaluateAst,
  interpret,
};
