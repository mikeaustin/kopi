import fs from 'fs';

import parser from '../lib/parser.js';

import interpreter from './visitors/Interpreter.mjs';
import typechecker from './visitors/Typechecker.mjs';

import _types from './types.js';

// const {
//   AnyType, NoneType, UnionType,
//   BooleanType, NumberType, StringType,
//   FunctionType,
//   IdentifierPatternType,
// } = require('./types');

const {
  AnyType, NoneType, UnionType,
  BooleanType, NumberType, StringType,
  FunctionType,
  IdentifierPatternType,
} = _types;

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

    return interpreter.visitNode(astRootNode, scope);
  } catch (error) {
    console.error(error.name === 'SyntaxError' ? `SyntaxError on line ${error.location.start.line}: ${error.message}` : error);

    process.exit(1);
  }
};

export {
  compile,
};
