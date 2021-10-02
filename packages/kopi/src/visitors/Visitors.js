const util = require("util");
const fs = require("fs");

const { KopiString, KopiTuple, KopiRange, KopiFunction } = require('../classes');
const {
  TuplePattern,
  BooleanLiteralPattern,
  IdentifierPattern,
  NumericLiteralPattern,
  StringLiteralPattern,
  ConstructorPattern,
  FunctionPattern
} = require('../classes');

const inspect = value => util.inspect(value, {
  compact: false,
  depth: Infinity
});

const parserLog = fs.createWriteStream('log/tracer');

class Visitors {
  visitNode(astNode, scope, bind) {
    if (!astNode) {
      return;
    }

    parserLog.write(`${astNode.constructor.name}` + (() => {
      switch (astNode.constructor.name) {
        case 'Identifier': return ` '${astNode.name}'`;
        case 'ApplyExpression': return ` '${astNode.expr.name}'`;
        default: return '';
      }
    })() + '\n');

    if (this[astNode.constructor.name]) {
      return this[astNode.constructor.name](astNode, scope, bind);
    } else {
      throw new Error(`No AST visitor for '${astNode.constructor.name}'`);
    }
  }
}

module.exports = {
  default: Visitors
};
