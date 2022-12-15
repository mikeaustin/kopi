var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KopiValue } from '../../shared.js';
import { KopiApplicative } from '../../shared.js';
class KopiFunction extends KopiValue {
    constructor(parameterPattern, bodyExpression, environment, name) {
        super();
        this.parameterPattern = parameterPattern;
        this.bodyExpression = bodyExpression;
        this.environment = environment;
        this.name = name;
    }
    apply(thisArg, [argument, context]) {
        return __awaiter(this, void 0, void 0, function* () {
            const { evaluateAst, bindValues } = context;
            const matches = yield this.parameterPattern.match(argument, context);
            const newEnvironment = Object.assign(Object.assign(Object.assign(Object.assign({}, this.environment), matches), (this.name ? { [this.name]: this } : {})), { 'this': thisArg });
            Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(this.environment));
            return evaluateAst(this.bodyExpression, newEnvironment, bindValues);
        });
    }
}
KopiFunction.traits = [KopiApplicative];
export default KopiFunction;
