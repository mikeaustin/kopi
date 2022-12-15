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
class KopiType extends KopiValue {
    constructor(_constructor) {
        super();
        this._constructor = _constructor;
    }
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._constructor.prototype.inspect.apply(undefined, []);
        });
    }
    apply(thisArg, [argument, context]) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._constructor.create(argument);
            // return new this._constructor(argument);
        });
    }
}
KopiType.traits = [KopiApplicative];
export default KopiType;
