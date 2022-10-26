import * as parser from './lib/parser';

import { RawASTNode, ASTNode, Environment } from './modules2/shared';

import * as operators from './modules2/operators';
import * as terminals from './modules2/terminals';
import { KopiNumber } from './modules2/terminals';

import { KopiValue } from './modules2/shared';

class NativeFunction<TArg> extends KopiValue {
  constructor(name: string, argType: Function, func: (arg: TArg) => Promise<KopiValue>) {
    super();

    this.name = name;
    this.func = func;
    this.argType = argType;
  }

  async apply(thisArg: KopiValue, [arg]: [TArg]): Promise<KopiValue> {
    if (!(arg instanceof this.argType)) {
      throw new Error(`${this.name}() only accepts a ${this.argType} as an argument, not ${arg}`);
    }

    return this.func.apply(thisArg, [arg]);
  }


  name: string;
  func: (arg: TArg) => Promise<KopiValue>;
  argType: Function;
}

const environment = {
  x: new KopiNumber(3),
  // sleep: ((value: KopiValue) => {
  //   if (!(value instanceof KopiNumber)) {
  //     throw new Error(`round() only accepts a number as an argument`);
  //   }

  //   return new Promise((resolve) => {
  //     setTimeout(() => resolve(value), value.value * 1000);
  //   });
  // }) as unknown as KopiValue,
  sleep: new NativeFunction('sleep', KopiNumber, (value: KopiNumber) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), value.value * 1000);
    });
  }),
  round: ((value: KopiValue) => {
    if (!(value instanceof KopiNumber)) {
      throw new Error(`round() only accepts a number as an argument`);
    }

    return new KopiNumber(Math.round(value.value));
  }) as unknown as KopiValue,
};

// NativeFunction = (type, func) =>

// const ast = parser.parse('(1, 2, 3)');
// const ast = parser.parse('(1, (() => 2), 3)');
// const ast = parser.parse('(1 + 2) * x');
// const ast = parser.parse('() => (1 + 2) * x');
// const ast = parser.parse('() => 2, 3');
// const ast = parser.parse('() => 2, 3, () => 2, 3');
// const ast = parser.parse('() => () => (2, 3)');
// const ast = parser.parse('(() => 5) ()');
// const ast = parser.parse('(() => 3) () + round 2.7');

const ast = parser.parse('(sleep (sleep 1) + sleep (sleep 1), sleep 1 + sleep 1)');

const transform = (ast: RawASTNode) => {
  return transformPipeline(ast);
};

const transformPipeline = operators.transform(terminals.transform, transform);

const evaluate = (ast: ASTNode, environment: Environment) => {
  return evaluatePipeline(ast, environment);
};

const evaluatePipeline = operators.evaluate(terminals.evaluate, evaluate);

const transformedAst = transformPipeline(ast);

const main = async () => {
  console.log(transformedAst);
  console.log(await (await evaluate(transformedAst, environment)).inspect());
};

main();
