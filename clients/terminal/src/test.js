"use strict";
exports.__esModule = true;
var parser = require("./lib/parser");
var operators = require("./modules2/operators");
var terminals = require("./modules2/terminals");
var value = parser.parse('(1 + 2) * x');
var transform = function (astNode) {
    return transformPipeline(astNode);
};
var transformPipeline = operators.transform(terminals.transform, transform);
var evaluate = function (astNode, environment) {
    return evaluatePipeline(astNode, environment);
};
var evaluatePipeline = operators.evaluate(terminals.evaluate, evaluate);
var environment = {
    x: new terminals.KopiNumber(3)
};
var transformedAST = transformPipeline(value);
console.log(transformedAST, '\n', evaluatePipeline(transformedAST, environment));
