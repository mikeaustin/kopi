var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ASTNode, ASTPatternNode, KopiApplicative } from '../shared.js';
import { KopiArray, KopiBoolean, KopiNumber, KopiString, KopiTuple } from './classes/index.js';
class RangeExpression extends ASTNode {
    constructor({ from, to, location }) {
        super(location);
        this.from = from;
        this.to = to;
    }
}
//
class NumericLiteral extends ASTNode {
    constructor({ value, location }) {
        super(location);
        this.value = value;
    }
}
class BooleanLiteral extends ASTNode {
    constructor({ value, location }) {
        super(location);
        this.value = value;
    }
}
class StringLiteral extends ASTNode {
    constructor({ value, location }) {
        super(location);
        this.value = value;
    }
}
class ArrayLiteral extends ASTNode {
    constructor({ expressionElements, location }) {
        super(location);
        this.expressionElements = expressionElements;
    }
}
class DictLiteral extends ASTNode {
    constructor({ expressionEntries, location }) {
        super(location);
        this.expressionEntries = expressionEntries;
    }
}
class AstLiteral extends ASTNode {
    constructor({ value, location }) {
        super(location);
        this.value = value;
    }
}
class Identifier extends ASTNode {
    constructor({ name, location }) {
        super(location);
        this.name = name;
    }
    '=='(that) {
        return new KopiBoolean(this.name === that.name);
    }
    apply(thisArg, [argument, context]) {
        return __awaiter(this, void 0, void 0, function* () {
            return argument.invoke(this.name, [KopiTuple.empty, context]);
        });
    }
}
Identifier.traits = [KopiApplicative];
//
// Paterns
//
class NumericLiteralPattern extends ASTPatternNode {
    constructor({ value, location }) {
        super(location);
        this.value = value;
    }
    match(number, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (number instanceof KopiNumber && number.value === this.value) {
                return {};
            }
            return undefined;
        });
    }
}
class StringLiteralPattern extends ASTPatternNode {
    constructor({ value, location }) {
        super(location);
        this.value = value;
    }
    match(string, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (string instanceof KopiString && string.value === this.value) {
                return {};
            }
            return undefined;
        });
    }
}
class BooleanLiteralPattern extends ASTPatternNode {
    constructor({ value, location }) {
        super(location);
        this.value = value;
    }
    match(boolean, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (boolean instanceof KopiBoolean && boolean.value === this.value) {
                return {};
            }
            return undefined;
        });
    }
}
class IdentifierPattern extends ASTPatternNode {
    constructor({ name, defaultExpression, location }) {
        super(location);
        this.name = name;
        this.defaultExpression = defaultExpression;
    }
    match(value, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { environment, evaluateAst, bindValues } = context;
            if ((value === undefined || (value === KopiTuple.empty))) {
                if (this.defaultExpression !== null) {
                    return {
                        [this.name]: yield evaluateAst(this.defaultExpression, environment, bindValues)
                    };
                }
                else {
                    return undefined;
                }
            }
            return {
                [this.name]: value
            };
        });
    }
}
class TupleLiteralPattern extends ASTPatternNode {
    constructor({ patterns, location }) {
        super(location);
        this.patterns = patterns;
    }
    match(tuple, context) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (tuple === undefined) {
                throw new Error('TupleLiteralPattern match(): value is not a tuple');
            }
            try {
                let bindings = {};
                const fields = tuple.fields;
                for (const [index, pattern] of this.patterns.entries()) {
                    let matches = yield pattern.match((_a = yield fields[index]) !== null && _a !== void 0 ? _a : KopiTuple.empty, context);
                    if (matches === undefined) {
                        return undefined;
                    }
                    bindings = Object.assign(Object.assign({}, bindings), matches);
                }
                return bindings;
            }
            catch (error) {
                throw Error('TupleLiteralPattern.match\n  ' + error.message);
            }
        });
    }
}
class ArrayLiteralPattern extends ASTPatternNode {
    constructor({ patterns, defaultExpression, location }) {
        super(location);
        this.patterns = patterns;
        this.defaultExpression = defaultExpression;
    }
    match(array, context) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { environment, evaluateAst, bindValues } = context;
            if (array === undefined) {
                throw new Error('ArrayLiteralPattern match(): value is not an array');
            }
            if (array === KopiTuple.empty) {
                array = (yield evaluateAst(this.defaultExpression, environment, bindValues));
            }
            if (array instanceof KopiArray) {
                let bindings = {};
                for (const [index, pattern] of this.patterns.entries()) {
                    let matches = yield pattern.match((_a = yield array.elements[index]) !== null && _a !== void 0 ? _a : KopiTuple.empty, context);
                    if (matches === undefined) {
                        return undefined;
                    }
                    bindings = Object.assign(Object.assign({}, bindings), matches);
                }
                return bindings;
            }
            throw Error('ArrayLiteralPattern.match: error');
        });
    }
}
class FunctionPattern extends ASTPatternNode {
    constructor({ name, parameterPattern, location }) {
        super(location);
        this.name = name;
        this.parameterPattern = parameterPattern;
    }
    match(value, context) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                [this.name]: value,
            };
        });
    }
}
export { RangeExpression, 
//
NumericLiteral, BooleanLiteral, StringLiteral, ArrayLiteral, DictLiteral, AstLiteral, Identifier, NumericLiteralPattern, StringLiteralPattern, BooleanLiteralPattern, IdentifierPattern, TupleLiteralPattern, ArrayLiteralPattern, FunctionPattern, };
