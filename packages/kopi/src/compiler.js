const util = require('util');
const fs = require('fs');

const parser = require('../lib/parser');

const { default: interpreter } = require('./visitors/Interpreter');

const compile = async (filename, scope) => {
  const source = await util.promisify(fs.readFile)(filename, 'utf8');

  try {
    const astRootNode = parser.parse(source);

    return await interpreter.visitNode(astRootNode, scope);
  } catch (error) {
    console.error(error.name === 'SyntaxError' ? error.message : error);
  }
};

module.exports = {
  compile,
};
