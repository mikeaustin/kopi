var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KopiNumeric, KopiApplicative } from '../shared.js';
import { KopiTuple, KopiFunction } from '../terminals/classes/index.js';
import * as astNodes from './astNodes.js';
import * as terminalAstNodes from '../terminals/astNodes.js';
function Assignment({ pattern, expression }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, evaluateAst, bindValues } = context;
        if (pattern instanceof terminalAstNodes.FunctionPattern) {
            expression = new astNodes.FunctionExpression({
                parameterPattern: pattern.parameterPattern,
                bodyExpression: expression,
                name: pattern.name,
            });
        }
        const expressionValue = yield evaluateAst(expression, environment, bindValues);
        const patternMatches = yield pattern.match(expressionValue, { environment, evaluateAst, bindValues });
        if (patternMatches && bindValues) {
            bindValues(patternMatches);
        }
        return KopiTuple.empty;
    });
}
function BlockExpression({ statements }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        let { environment, evaluateAst } = context;
        const newEnvironment = {};
        Object.setPrototypeOf(newEnvironment, environment);
        environment = newEnvironment;
        const bindValues = (bindings) => {
            const newEnvironment = Object.assign(Object.assign({}, environment), bindings);
            Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(environment));
            environment = newEnvironment;
        };
        return statements.reduce((result, statement) => __awaiter(this, void 0, void 0, function* () {
            return ((yield result, yield evaluateAst(statement, environment, bindValues)));
        }), Promise.resolve(KopiTuple.empty));
    });
}
function PipeExpression({ expression, methodName, argumentExpression }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, evaluateAst, bindValues } = context;
        const expressionValue = yield evaluateAst(expression, environment, bindValues);
        const argumentValue = argumentExpression ? yield evaluateAst(argumentExpression, environment, bindValues) : KopiTuple.empty;
        return expressionValue.invoke(methodName, [argumentValue, context]);
    });
}
function OperatorExpression({ operator, leftExpression, rightExpression }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, evaluateAst, bindValues } = context;
        const [leftValue, rightValue] = yield Promise.all([
            evaluateAst(leftExpression, environment, bindValues),
            evaluateAst(rightExpression, environment, bindValues),
        ]);
        if (operator === '+' || operator === '-' || operator === '*' || operator === '/' || operator === '%') {
            if (leftValue.constructor.traits.includes(KopiNumeric)) {
                return leftValue[operator](rightValue);
            }
        }
        else if (operator === '++' || operator === '==' || operator === '!=' || operator === '<' || operator === '>' || operator === '<=' || operator === '>=') {
            // return leftValue.invoke(operator, [rightValue, context]);
            return leftValue[operator](rightValue, context);
        }
        throw new Error(`'${yield leftValue.inspect()}' of type ${leftValue.constructor.name} doesn't have an operator method '${operator}'`);
    });
}
function MemberExpression({ expression, member }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, evaluateAst, bindValues } = context;
        const expressionValue = yield evaluateAst(expression, environment, bindValues);
        const value = expressionValue[member];
        if (value !== undefined) {
            return Promise.resolve(value);
        }
        throw new Error(`${yield expression.inspect()} doesn't have a member '${member}'`);
    });
}
function UnaryExpression({ operator, argumentExpression }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, evaluateAst, bindValues } = context;
        const argumentValue = yield evaluateAst(argumentExpression, environment, bindValues);
        if (argumentValue.constructor.traits.includes(KopiNumeric)) {
            if (operator === '-') {
                return argumentValue.negate();
            }
        }
        else {
            return argumentValue[operator](argumentValue, context);
        }
        throw new Error(`'${yield argumentValue.inspect()}' of type '${argumentValue.constructor.name}' doesn't have a unary method '${operator}'`);
    });
}
function TupleExpression({ expressionFields, expressionFieldNames }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, evaluateAst, bindValues } = context;
        return new KopiTuple(expressionFields.map(expressionField => evaluateAst(expressionField, environment, bindValues)), expressionFieldNames);
    });
}
function FunctionExpression({ parameterPattern, bodyExpression, name }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment } = context;
        return new KopiFunction(parameterPattern, bodyExpression, environment, name);
    });
}
function ApplyExpression({ expression, argumentExpression }, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { environment, evaluateAst, bindValues } = context;
        const func = yield evaluateAst(expression, environment, bindValues);
        if (func.constructor.traits.includes(KopiApplicative)) {
            return func.apply(undefined, [yield evaluateAst(argumentExpression, environment, bindValues), context]);
        }
        throw new Error(`No KopiApplicative.apply() method found for ${func.constructor.name}`);
    });
}
export { Assignment, PipeExpression, BlockExpression, OperatorExpression, MemberExpression, UnaryExpression, TupleExpression, FunctionExpression, ApplyExpression, };
