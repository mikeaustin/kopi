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
exports.KopiNumber = exports.BooleanLiteral = exports.NumericLiteral = exports.Identifier = exports.evaluate = exports.transform = void 0;
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
var AstLiteral = /** @class */ (function (_super) {
    __extends(AstLiteral, _super);
    function AstLiteral(_a) {
        var value = _a.value, location = _a.location;
        var _this = _super.call(this, location) || this;
        _this.value = value;
        return _this;
    }
    return AstLiteral;
}(shared_1.ASTNode));
var Identifier = /** @class */ (function (_super) {
    __extends(Identifier, _super);
    function Identifier(_a) {
        var name = _a.name, location = _a.location;
        var _this = _super.call(this, location) || this;
        _this.name = name;
        return _this;
    }
    Identifier.prototype.apply = function (thisArg, _a) {
        var arg = _a[0];
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, arg[this.name]()];
            });
        });
    };
    return Identifier;
}(shared_1.ASTNode));
exports.Identifier = Identifier;
//
var transform = function (transform) { return function (rawAstNode) {
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
        case 'AstLiteral':
            return new AstLiteral({
                value: transform(rawAstNode.value),
                location: rawAstNode.location
            });
        case 'Identifier':
            return new Identifier({
                name: rawAstNode.name,
                location: rawAstNode.location
            });
    }
    throw new Error("No transform found for '".concat(rawAstNode.type, "'"));
}; };
exports.transform = transform;
var evaluate = function (astNode, environment) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (astNode instanceof NumericLiteral) {
            return [2 /*return*/, new classes_1.KopiNumber(astNode.value)];
        }
        else if (astNode instanceof BooleanLiteral) {
            return [2 /*return*/, new classes_1.KopiBoolean(astNode.value)];
        }
        else if (astNode instanceof AstLiteral) {
            return [2 /*return*/, astNode.value];
        }
        else if (astNode instanceof Identifier) {
            if (!(astNode.name in environment)) {
                throw new Error("Variable '".concat(astNode.name, "' not found in current scope"));
            }
            return [2 /*return*/, environment[astNode.name]];
        }
        else {
            throw new Error("No visitor found for '".concat(astNode.constructor.name, "'"));
        }
        return [2 /*return*/];
    });
}); };
exports.evaluate = evaluate;
