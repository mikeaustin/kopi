import * as parser from './lib/parser';

import { RawASTNode, ASTNode, Environment, inspect } from './modules2/shared';

import * as operators from './modules2/operators';
import * as terminals from './modules2/terminals';
import { KopiNumber } from './modules2/terminals';

import { KopiValue } from './modules2/shared';

class NativeFunction<TArg> extends KopiValue {
  constructor(name: string, argType: Function = KopiValue, func: (arg: TArg) => Promise<KopiValue>) {
    super();

    this.name = name;
    this.argType = argType;
    this.func = func;
  }

  async apply(thisArg: KopiValue, [arg]: [TArg]): Promise<KopiValue> {
    if (!(arg instanceof this.argType)) {
      throw new Error(`${this.name}() only accepts a ${this.argType} as an argument, not ${arg}`);
    }

    return this.func.apply(thisArg, [arg]);
  }

  name: string;
  argType: Function;
  func: (arg: TArg) => Promise<KopiValue>;
}

const environment = {
  x: new KopiNumber(3),
  sleep: new NativeFunction('sleep', KopiNumber, async (value: KopiNumber) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), value.value * 1000);
    });
  }),
  round: new NativeFunction('round', KopiNumber, async (value: KopiNumber) => {
    return new KopiNumber(Math.round(value.value));
  }),
};

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
// const ast = parser.parse(`5 * 'sin 1 + 5 * 'cos 1`);
// const ast = parser.parse(`'(('sin 5) 1, 'sin 5)`);
// const ast = parser.parse(`'('1, 2, 3)`);

const transform = (ast: RawASTNode) => {
  return transformPipeline(ast);
};

const transformPipeline = operators.transform(terminals.transform(transform), transform);

const evaluate = (ast: ASTNode, environment: Environment) => {
  return evaluatePipeline(ast, environment);
};

const evaluatePipeline = operators.evaluate(terminals.evaluate, evaluate);

const transformedAst = transformPipeline(ast);

const main = async () => {
  console.log(inspect(transformedAst));
  console.log(await (await evaluate(transformedAst, environment)).inspect());
};

// main();

export {
  transform,
  evaluate,
};
