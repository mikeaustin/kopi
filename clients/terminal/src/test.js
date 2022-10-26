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
var parser = require("./lib/parser");
var operators = require("./modules2/operators");
var terminals = require("./modules2/terminals");
var terminals_1 = require("./modules2/terminals");
var shared_1 = require("./modules2/shared");
var NativeFunction = /** @class */ (function (_super) {
    __extends(NativeFunction, _super);
    function NativeFunction(name, argType, func) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.func = func;
        _this.argType = argType;
        return _this;
    }
    NativeFunction.prototype.apply = function (thisArg, _a) {
        var arg = _a[0];
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                if (!(arg instanceof this.argType)) {
                    throw new Error("".concat(this.name, "() only accepts a ").concat(this.argType, " as an argument, not ").concat(arg));
                }
                return [2 /*return*/, this.func.apply(thisArg, [arg])];
            });
        });
    };
    return NativeFunction;
}(shared_1.KopiValue));
var environment = {
    x: new terminals_1.KopiNumber(3),
    sleep: new NativeFunction('sleep', terminals_1.KopiNumber, function (value) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () { return resolve(value); }, value.value * 1000);
                })];
        });
    }); }),
    round: new NativeFunction('round', terminals_1.KopiNumber, function (value) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!(value instanceof terminals_1.KopiNumber)) {
                throw new Error("round() only accepts a number as an argument");
            }
            return [2 /*return*/, new terminals_1.KopiNumber(Math.round(value.value))];
        });
    }); })
};
// NativeFunction = (type, func) =>
// const ast = parser.parse('(1, 2, 3)');
// const ast = parser.parse('(1, (() => 2), 3)');
// const ast = parser.parse('(1 + 2) * x');
// const ast = parser.parse('() => (1 + 2) * x');
// const ast = parser.parse('() => 2, 3');
// const ast = parser.parse('() => 2, 3, () => 2, 3');
// const ast = parser.parse('() => () => (2, 3)');
// const ast = parser.parse('(() => 5) ()');
// const ast = parser.parse('(() => 3) () + round 2.7');
var ast = parser.parse('(sleep (sleep 1) + sleep (sleep 1), sleep 1 + sleep 1)');
var transform = function (ast) {
    return transformPipeline(ast);
};
var transformPipeline = operators.transform(terminals.transform, transform);
var evaluate = function (ast, environment) {
    return evaluatePipeline(ast, environment);
};
var evaluatePipeline = operators.evaluate(terminals.evaluate, evaluate);
var transformedAst = transformPipeline(ast);
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log(transformedAst);
                _b = (_a = console).log;
                return [4 /*yield*/, evaluate(transformedAst, environment)];
            case 1: return [4 /*yield*/, (_c.sent()).inspect()];
            case 2:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); };
main();
