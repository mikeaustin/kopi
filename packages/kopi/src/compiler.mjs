import fs from 'fs';

import parser from '../lib/parser.js';

import interpreter from './visitors/Interpreter.mjs';
import typechecker from './visitors/Typechecker.mjs';

import {
  AnyType, NoneType, UnionType,
  BooleanType, NumberType, StringType, FunctionType,
  IdentifierPatternType,
} from './types.mjs';

class TypeVar {
  constructor(type) {
    this._delegate = null;
  }

  get name() {
    return this._delegate?.name;
  }

  getTypeMatches(type) {
    return this._delegate.getTypeMatches(type);
  }

  isSupertypeOf(type) {
    return this._delegate.isSupertypeOf(type);
  }
}

const T = new TypeVar();

const context = {
  ident: new FunctionType(
    new IdentifierPatternType('value', T),
    T,
  ),
  print: new FunctionType(
    new IdentifierPatternType('value', new AnyType()),
    new NoneType(),
  ),
  even: new FunctionType(
    new IdentifierPatternType('value', new NumberType()),
    new BooleanType(),
  ),
  test: new FunctionType(
    new IdentifierPatternType('value', new FunctionType(
      new IdentifierPatternType('x', new AnyType()),
      new StringType(),
    )),
    new AnyType(),
  ),
  union: new FunctionType(
    new IdentifierPatternType('value', new UnionType([
      new NumberType(),
      new StringType(),
    ])),
    new NoneType(),
  ),
  true: new BooleanType(),
  false: new BooleanType(),
};

const compile = async (filename, scope) => {
  const source = await fs.promises.readFile(filename, 'utf8');

  try {
    const astRootNode = parser.parse(source);

    if (source.startsWith('# enable: typechecking')) {
      typechecker.visitNode(astRootNode, context);
    }

    return await interpreter.visitNode(astRootNode, scope);
  } catch (error) {
    if (error.name === 'SyntaxError') {
      console.error(`*** ${error.name}: ${error.message}\n  ${filename} [Line ${error.location.start.line}]`);
    } else if (error.name === 'RuntimeError') {
      console.error('***', error.stack);
    } else {
      console.error(`*** JavaScript ${error.stack}`);
    }

    process.exit(1);
  }
};

export {
  compile,
};
