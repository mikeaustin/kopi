var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as astNodes from './astNodes.js';
import * as visitors from './visitors.js';
const transformAst = (next, transformAst) => (rawAstNode) => {
    switch (rawAstNode.type) {
        case 'Assignment':
            return new astNodes.Assignment({
                pattern: transformAst(rawAstNode.pattern),
                expression: transformAst(rawAstNode.expression),
            });
        case 'PipeExpression':
            return new astNodes.PipeExpression({
                expression: transformAst(rawAstNode.expression),
                methodName: rawAstNode.methodName,
                argumentExpression: rawAstNode.argumentExpression ? transformAst(rawAstNode.argumentExpression) : rawAstNode.argumentExpression,
            });
        case 'BlockExpression':
            return new astNodes.BlockExpression({
                statements: rawAstNode.statements.map((statement) => transformAst(statement)),
            });
        case 'OperatorExpression':
            return new astNodes.OperatorExpression({
                operator: rawAstNode.operator,
                leftExpression: transformAst(rawAstNode.leftExpression),
                rightExpression: transformAst(rawAstNode.rightExpression),
                location: rawAstNode.location,
            });
        case 'MemberExpression':
            return new astNodes.MemberExpression({
                expression: transformAst(rawAstNode.expression),
                member: rawAstNode.member,
            });
        case 'UnaryExpression':
            return new astNodes.UnaryExpression({
                operator: rawAstNode.operator,
                argumentExpression: transformAst(rawAstNode.argumentExpression),
                location: rawAstNode.location,
            });
        case 'FunctionExpression':
            return new astNodes.FunctionExpression({
                parameterPattern: transformAst(rawAstNode.parameterPattern),
                bodyExpression: transformAst(rawAstNode.bodyExpression),
                location: rawAstNode.location,
            });
        case 'TupleExpression':
            return new astNodes.TupleExpression({
                expressionFields: rawAstNode.expressionFields.map((expressionElement) => transformAst(expressionElement)),
                expressionFieldNames: rawAstNode.expressionFieldNames,
                location: rawAstNode.location,
            });
        case 'ApplyExpression':
            return new astNodes.ApplyExpression({
                expression: transformAst(rawAstNode.expression),
                argumentExpression: transformAst(rawAstNode.argumentExpression),
                location: rawAstNode.location,
            });
        default:
            return next(rawAstNode);
    }
};
const evaluateAst = (next, evaluateAst) => (astNode, environment, bindValues) => __awaiter(void 0, void 0, void 0, function* () {
    const context = { environment, evaluateAst, bindValues };
    if (astNode instanceof astNodes.Assignment) {
        return visitors.Assignment(astNode, context);
    }
    else if (astNode instanceof astNodes.PipeExpression) {
        return visitors.PipeExpression(astNode, context);
    }
    else if (astNode instanceof astNodes.BlockExpression) {
        return visitors.BlockExpression(astNode, context);
    }
    else if (astNode instanceof astNodes.OperatorExpression) {
        return visitors.OperatorExpression(astNode, context);
    }
    else if (astNode instanceof astNodes.MemberExpression) {
        return visitors.MemberExpression(astNode, context);
    }
    else if (astNode instanceof astNodes.UnaryExpression) {
        return visitors.UnaryExpression(astNode, context);
    }
    else if (astNode instanceof astNodes.TupleExpression) {
        return visitors.TupleExpression(astNode, context);
    }
    else if (astNode instanceof astNodes.FunctionExpression) {
        return visitors.FunctionExpression(astNode, context);
    }
    else if (astNode instanceof astNodes.ApplyExpression) {
        return visitors.ApplyExpression(astNode, context);
    }
    else {
        return next(astNode, environment, bindValues);
    }
});
export { transformAst, evaluateAst, };
