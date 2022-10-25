"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.KopiNumber = exports.BooleanLiteral = exports.NumericLiteral = exports.evaluate = exports.transform = void 0;
var shared_1 = require("../shared");
var classes_1 = require("./classes");
exports.KopiNumber = classes_1.KopiNumber;
var NumericLiteral = /** @class */ (function (_super) {
    __extends(NumericLiteral, _super);
    function NumericLiteral(_a) {
        var value = _a.value, location = _a.location;
        var _this = _super.call(this, location) || this;
        _this.value = value;
        return _this;
    }
    return NumericLiteral;
}(shared_1.ASTNode));
exports.NumericLiteral = NumericLiteral;
var BooleanLiteral = /** @class */ (function (_super) {
    __extends(BooleanLiteral, _super);
    function BooleanLiteral(_a) {
        var value = _a.value, location = _a.location;
        var _this = _super.call(this, location) || this;
        _this.value = value;
        return _this;
    }
    return BooleanLiteral;
}(shared_1.ASTNode));
exports.BooleanLiteral = BooleanLiteral;
var Identifier = /** @class */ (function (_super) {
    __extends(Identifier, _super);
    function Identifier(_a) {
        var name = _a.name, location = _a.location;
        var _this = _super.call(this, location) || this;
        _this.name = name;
        return _this;
    }
    return Identifier;
}(shared_1.ASTNode));
var TupleExpression = /** @class */ (function (_super) {
    __extends(TupleExpression, _super);
    function TupleExpression(_a) {
        var elements = _a.elements, location = _a.location;
        var _this = _super.call(this, location) || this;
        _this.elements = elements;
        return _this;
    }
    return TupleExpression;
}(shared_1.ASTNode));
//
var transform = function (rawAstNode) {
    switch (rawAstNode.type) {
        case 'NumericLiteral':
            return new NumericLiteral({
                value: rawAstNode.value,
                location: rawAstNode.location
            });
        case 'BooleanLiteral':
            return new BooleanLiteral({
                value: rawAstNode.value,
                location: rawAstNode.location
            });
        case 'Identifier':
            return new Identifier({
                name: rawAstNode.name,
                location: rawAstNode.location
            });
        case 'TupleExpression':
            return new TupleExpression({
                elements: rawAstNode.elements,
                location: rawAstNode.location
            });
    }
    throw new Error("No transform found for '".concat(rawAstNode.type, "'"));
};
exports.transform = transform;
var evaluate = function (astNode, environment) {
    if (astNode instanceof NumericLiteral) {
        return new classes_1.KopiNumber(astNode.value);
    }
    else if (astNode instanceof BooleanLiteral) {
        return new classes_1.KopiBoolean(astNode.value);
    }
    else if (astNode instanceof Identifier) {
        if (!(astNode.name in environment)) {
            throw new Error("Variable '".concat(astNode.name, "' not found in current scope"));
        }
        return environment[astNode.name];
    }
    else {
        throw new Error("No visitor found for '".concat(astNode.constructor.name, "'"));
    }
};
exports.evaluate = evaluate;
