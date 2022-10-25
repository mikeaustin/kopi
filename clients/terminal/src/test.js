"use strict";
exports.__esModule = true;
var parser = require("./lib/parser");
var operators = require("./modules2/operators");
var terminals = require("./modules2/terminals");
var value = parser.parse('2 + 3');
var transform = function (astNode) {
    return transformPipeline(astNode);
};
var transformPipeline = operators.transform(terminals.transform, transform);
var evaluate = function (astNode) {
    return evaluatePipeline(astNode);
};
var evaluatePipeline = operators.evaluate(terminals.evaluate, evaluate);
var transformedAST = transformPipeline(value);
console.log(transformedAST, evaluatePipeline(transformedAST));
