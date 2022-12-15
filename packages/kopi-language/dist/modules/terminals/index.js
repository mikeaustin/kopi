var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { inspect } from '../utils.js';
import * as astNodes from './astNodes.js';
import * as visitors from './visitors.js';
// const transformAst2 = (transformAst: (rawAstNode: RawASTNode) => ASTNode) => (rawAstNode: RawASTNode) => {
//   if ()
// };
const transformAst = (transformAst) => (rawAstNode) => {
    switch (rawAstNode.type) {
        case 'RangeExpression':
            return new astNodes.RangeExpression({
                from: transformAst(rawAstNode.from),
                to: transformAst(rawAstNode.to),
                location: rawAstNode.location,
            });
        //
        case 'NumericLiteral':
            return new astNodes.NumericLiteral({
                value: rawAstNode.value,
                location: rawAstNode.location,
            });
        case 'BooleanLiteral':
            return new astNodes.BooleanLiteral({
                value: rawAstNode.value,
                location: rawAstNode.location,
            });
        case 'StringLiteral':
            return new astNodes.StringLiteral({
                value: rawAstNode.value,
                location: rawAstNode.location,
            });
        case 'ArrayLiteral':
            return new astNodes.ArrayLiteral({
                expressionElements: rawAstNode.expressionElements.map((expression) => transformAst(expression)),
                location: rawAstNode.location,
            });
        case 'DictLiteral':
            return new astNodes.DictLiteral({
                expressionEntries: rawAstNode.expressionEntries.map(([key, expression]) => [
                    transformAst(key),
                    transformAst(expression)
                ]),
                location: rawAstNode.location,
            });
        case 'AstLiteral':
            return new astNodes.AstLiteral({
                value: transformAst(rawAstNode.value),
                location: rawAstNode.location,
            });
        case 'Identifier':
            return new astNodes.Identifier({
                name: rawAstNode.name,
                location: rawAstNode.location,
            });
        case 'NumericLiteralPattern':
            return new astNodes.NumericLiteralPattern({
                value: rawAstNode.value,
                location: rawAstNode.location,
            });
        case 'StringLiteralPattern':
            return new astNodes.StringLiteralPattern({
                value: rawAstNode.value,
                location: rawAstNode.location,
            });
        case 'BooleanLiteralPattern':
            return new astNodes.BooleanLiteralPattern({
                value: rawAstNode.value,
                location: rawAstNode.location,
            });
        case 'IdentifierPattern':
            return new astNodes.IdentifierPattern({
                name: rawAstNode.name,
                location: rawAstNode.location,
                defaultExpression: rawAstNode.defaultExpression
                    ? transformAst(rawAstNode.defaultExpression)
                    : rawAstNode.defaultExpression,
            });
        case 'TupleLiteralPattern':
            return new astNodes.TupleLiteralPattern({
                patterns: rawAstNode.patterns.map((pattern) => transformAst(pattern)),
                location: rawAstNode.location,
            });
        case 'ArrayLiteralPattern':
            return new astNodes.ArrayLiteralPattern({
                patterns: rawAstNode.patterns.map((pattern) => transformAst(pattern)),
                defaultExpression: rawAstNode.defaultExpression
                    ? transformAst(rawAstNode.defaultExpression)
                    : rawAstNode.defaultExpression,
                location: rawAstNode.location,
            });
        case 'FunctionPattern':
            return new astNodes.FunctionPattern({
                name: rawAstNode.name,
                parameterPattern: transformAst(rawAstNode.parameterPattern),
                location: rawAstNode.location,
            });
    }
    throw new Error(`No transformAst found for '${inspect(rawAstNode)}'`);
};
const evaluateAst = (evaluateAst) => (astNode, environment, bindValues) => __awaiter(void 0, void 0, void 0, function* () {
    const context = { environment, evaluateAst, bindValues };
    if (astNode instanceof astNodes.RangeExpression) {
        return visitors.RangeExpression(astNode, context);
    }
    else if (astNode instanceof astNodes.NumericLiteral) {
        return visitors.NumericLiteral(astNode, context);
    }
    else if (astNode instanceof astNodes.BooleanLiteral) {
        return visitors.BooleanLiteral(astNode, context);
    }
    else if (astNode instanceof astNodes.StringLiteral) {
        return visitors.StringLiteral(astNode, context);
    }
    else if (astNode instanceof astNodes.ArrayLiteral) {
        return visitors.ArrayLiteral(astNode, context);
    }
    else if (astNode instanceof astNodes.DictLiteral) {
        return visitors.DictLiteral(astNode, context);
    }
    else if (astNode instanceof astNodes.Identifier) {
        return visitors.Identifier(astNode, context);
    }
    else if (astNode instanceof astNodes.AstLiteral) {
        return astNode.value;
    }
    else {
        throw new Error(`No visitor found for '${inspect(astNode)}'`);
    }
});
export { transformAst, evaluateAst, };
