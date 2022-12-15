var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ASTNode, KopiApplicative } from '../shared.js';
class Assignment extends ASTNode {
    constructor({ pattern, expression, location }) {
        super(location);
        this.pattern = pattern;
        this.expression = expression;
    }
}
class PipeExpression extends ASTNode {
    constructor({ expression, methodName, argumentExpression, location }) {
        super(location);
        this.expression = expression;
        this.methodName = methodName;
        this.argumentExpression = argumentExpression;
    }
}
class BlockExpression extends ASTNode {
    constructor({ statements, location }) {
        super(location);
        this.statements = statements;
    }
}
class OperatorExpression extends ASTNode {
    constructor({ operator, leftExpression, rightExpression, location }) {
        super(location);
        this.operator = operator;
        this.leftExpression = leftExpression;
        this.rightExpression = rightExpression;
    }
}
class MemberExpression extends ASTNode {
    constructor({ expression, member, location }) {
        super(location);
        this.expression = expression;
        this.member = member;
    }
}
class UnaryExpression extends ASTNode {
    constructor({ operator, argumentExpression, location }) {
        super(location);
        this.operator = operator;
        this.argumentExpression = argumentExpression;
    }
}
class TupleExpression extends ASTNode {
    constructor({ expressionFields, expressionFieldNames, location }) {
        super(location);
        this.expressionFields = expressionFields;
        this.expressionFieldNames = expressionFieldNames;
    }
}
class ApplyExpression extends ASTNode {
    constructor({ expression, argumentExpression, location }) {
        super(location);
        this.expression = expression;
        this.argumentExpression = argumentExpression;
    }
    apply(thisArg, [argument, context]) {
        return __awaiter(this, void 0, void 0, function* () {
            const { environment, evaluateAst, bindValues } = context;
            const identifier = this.expression;
            const argumentValue = yield evaluateAst(this.argumentExpression, environment, bindValues);
            return argument[identifier.name].apply(argument, [argumentValue, context]);
        });
    }
}
ApplyExpression.traits = [KopiApplicative];
class FunctionExpression extends ASTNode {
    constructor({ parameterPattern, bodyExpression, name, location }) {
        super(location);
        this.parameterPattern = parameterPattern;
        this.bodyExpression = bodyExpression;
        this.name = name;
    }
}
export { Assignment, PipeExpression, BlockExpression, OperatorExpression, MemberExpression, UnaryExpression, TupleExpression, ApplyExpression, FunctionExpression, };
