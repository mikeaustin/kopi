var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KopiNumber, KopiBoolean, KopiString, KopiArray, KopiRange } from './classes/index.js';
import KopiDict from './classes/KopiDict.js';
function RangeExpression({ from, to }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, evaluateAst, bindValues } = context;
        return new KopiRange(yield evaluateAst(from, environment, bindValues), yield evaluateAst(to, environment, bindValues));
    });
}
//
function NumericLiteral({ value }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        return new KopiNumber(value);
    });
}
function BooleanLiteral({ value }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        return new KopiBoolean(value);
    });
}
function StringLiteral({ value }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        return new KopiString(value);
    });
}
function ArrayLiteral({ expressionElements }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, evaluateAst, bindValues } = context;
        return new KopiArray(expressionElements.map((expression) => evaluateAst(expression, environment, bindValues)));
    });
}
function DictLiteral({ expressionEntries }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, evaluateAst, bindValues } = context;
        return new KopiDict(yield Promise.all(expressionEntries.map(([key, expression]) => __awaiter(this, void 0, void 0, function* () {
            return [
                yield evaluateAst(key, environment, bindValues),
                evaluateAst(expression, environment, bindValues)
            ];
        }))));
    });
}
function Identifier(astNode, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment } = context;
        const value = environment[astNode.name];
        if (astNode.name in environment && value !== undefined) {
            return value;
        }
        throw new Error(`Variable '${astNode.name}' not found in current scope`);
    });
}
export { RangeExpression, 
//
NumericLiteral, BooleanLiteral, StringLiteral, ArrayLiteral, DictLiteral, Identifier };
