const util = require('util');
const fs = require('fs');

const parser = require('../lib/parser');

const { default: interpreter } = require('./visitors/Interpreter');
const { default: typechecker } = require('./visitors/Typechecker');

const { IdentifierPattern } = require('./classes');

const { AnyType, NoneType, BooleanType, NumberType, FunctionType } = require('./types');

const context = {
  print: new FunctionType(new IdentifierPattern('value', undefined, new AnyType()), new NoneType()),
  even: new FunctionType(new IdentifierPattern('value', undefined, new NumberType()), new BooleanType()),
  Number,
  String,
};

const compile = async (filename, scope) => {
  const source = await util.promisify(fs.readFile)(filename, 'utf8');

  try {
    const astRootNode = parser.parse(source);

    // typechecker.visitNode(astRootNode, context);

    return interpreter.visitNode(astRootNode, scope);
  } catch (error) {
    console.error(error.name === 'SyntaxError' ? error.message : error);
  }
};

module.exports = {
  compile,
};
