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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ApplyExpression = exports.evaluate = exports.transform = void 0;
var shared_1 = require("../shared");
var classes_1 = require("../terminals/classes");
var OperatorExpression = /** @class */ (function (_super) {
    __extends(OperatorExpression, _super);
    function OperatorExpression(_a) {
        var operator = _a.operator, leftExpression = _a.leftExpression, rightExpression = _a.rightExpression, location = _a.location;
        var _this = _super.call(this, location) || this;
        _this.operator = operator;
        _this.leftExpression = leftExpression;
        _this.rightExpression = rightExpression;
        return _this;
    }
    return OperatorExpression;
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
var ApplyExpression = /** @class */ (function (_super) {
    __extends(ApplyExpression, _super);
    function ApplyExpression(_a) {
        var expression = _a.expression, argument = _a.argument, location = _a.location;
        var _this = _super.call(this, location) || this;
        _this.expression = expression;
        _this.argument = argument;
        return _this;
    }
    ApplyExpression.prototype.apply = function (thisArg, _a) {
        var arg = _a[0];
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                console.log('here');
                return [2 /*return*/, arg[this.expression.name]()];
            });
        });
    };
    return ApplyExpression;
}(shared_1.ASTNode));
exports.ApplyExpression = ApplyExpression;
var FunctionExpression = /** @class */ (function (_super) {
    __extends(FunctionExpression, _super);
    function FunctionExpression(_a) {
        var parameters = _a.parameters, bodyExpression = _a.bodyExpression, location = _a.location;
        var _this = _super.call(this, location) || this;
        _this.parameters = parameters;
        _this.bodyExpression = bodyExpression;
        return _this;
    }
    return FunctionExpression;
}(shared_1.ASTNode));
//
var transform = function (next, transform) { return function (rawAstNode) {
    switch (rawAstNode.type) {
        case 'OperatorExpression':
            return new OperatorExpression({
                operator: rawAstNode.operator,
                leftExpression: transform(rawAstNode.leftExpression),
                rightExpression: transform(rawAstNode.rightExpression),
                location: rawAstNode.location
            });
        case 'FunctionExpression':
            return new FunctionExpression({
                parameters: rawAstNode.parameters,
                bodyExpression: transform(rawAstNode.bodyExpression),
                location: rawAstNode.location
            });
        case 'TupleExpression':
            return new TupleExpression({
                elements: rawAstNode.elements.map(function (element) { return transform(element); }),
                location: rawAstNode.location
            });
        case 'ApplyExpression':
            return new ApplyExpression({
                expression: transform(rawAstNode.expression),
                argument: transform(rawAstNode.argument),
                location: rawAstNode.location
            });
        default:
            return next(rawAstNode);
    }
}; };
exports.transform = transform;
var evaluate = function (next, evaluate) {
    return function (astNode, environment) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, leftValue, rightValue, func, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(astNode instanceof OperatorExpression)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all([
                            evaluate(astNode.leftExpression, environment),
                            evaluate(astNode.rightExpression, environment),
                        ])];
                case 1:
                    _a = _e.sent(), leftValue = _a[0], rightValue = _a[1];
                    if (astNode.operator in leftValue) {
                        return [2 /*return*/, leftValue[astNode.operator](rightValue)];
                    }
                    else {
                        throw new Error("".concat(leftValue, " doesn't have a method '").concat(astNode.operator, "'"));
                    }
                    return [3 /*break*/, 10];
                case 2:
                    if (!(astNode instanceof TupleExpression)) return [3 /*break*/, 3];
                    return [2 /*return*/, new classes_1.KopiTuple(astNode.elements.map(function (element) { return evaluate(element, environment); }))];
                case 3:
                    if (!(astNode instanceof FunctionExpression)) return [3 /*break*/, 4];
                    return [2 /*return*/, new classes_1.KopiFunction(astNode.parameters, astNode.bodyExpression, environment)];
                case 4:
                    if (!(astNode instanceof ApplyExpression)) return [3 /*break*/, 9];
                    return [4 /*yield*/, evaluate(astNode.expression, environment)];
                case 5:
                    func = _e.sent();
                    if (!('apply' in func)) return [3 /*break*/, 7];
                    _c = (_b = func)
                        .apply;
                    _d = [undefined];
                    return [4 /*yield*/, evaluate(astNode.argument, environment)];
                case 6: return [2 /*return*/, _c.apply(_b, _d.concat([[_e.sent()], evaluate]))];
                case 7: throw new Error("No apply() method found");
                case 8: return [3 /*break*/, 10];
                case 9: return [2 /*return*/, next(astNode, environment)];
                case 10: return [2 /*return*/];
            }
        });
    }); };
};
exports.evaluate = evaluate;
