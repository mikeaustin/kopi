const util = require('util');
const fs = require('fs');

const parser = require('../lib/parser');

const { default: interpreter } = require('./visitors/Interpreter');
const { default: typechecker } = require('./visitors/Typechecker');

const {
  AnyType, NoneType, UnionType,
  BooleanType, NumberType, StringType,
  FunctionType,
  IdentifierPatternType
} = require('./types');

// Match returns whatever the function returns

class TypeVar {
  constructor(type) {
    this._delegateType = null;
  }

  get name() {
    return this._delegateType.name;
  }

  getTypeMatches(type) {
    return this._delegateType.getTypeMatches(type);
  }

  isSupertypeOf(type) {
    return this._delegateType.isSupertypeOf(type);
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
    new NoneType()
  ),
  true: new BooleanType(),
  false: new BooleanType(),
  Number,
  String,
};

const compile = async (filename, scope) => {
  const source = await util.promisify(fs.readFile)(filename, 'utf8');

  try {
    const astRootNode = parser.parse(source);

    if (source.startsWith('# enable: typechecking')) {
      typechecker.visitNode(astRootNode, context);
    }

    return interpreter.visitNode(astRootNode, scope);
  } catch (error) {
    console.error(error.name === 'SyntaxError' ? error.message : error);
  }
};

module.exports = {
  compile,
};
