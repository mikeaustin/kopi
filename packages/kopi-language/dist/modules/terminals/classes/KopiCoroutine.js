var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KopiValue } from '../../../modules/shared.js';
import { KopiTuple } from '../../../modules/terminals/classes/index.js';
import { Deferred } from '../../utils.js';
class KopiCoroutine extends KopiValue {
    constructor() {
        super();
        this.deferred = [new Deferred(), new Deferred()];
    }
    yield(func, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.deferred[0];
            this.deferred[0] = new Deferred();
            const value = yield func.apply(KopiTuple.empty, [data, context]);
            this.deferred[1].resolve(value);
            this.deferred[1] = new Deferred();
        });
    }
    send(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.deferred[0].resolve(value);
            const x = yield this.deferred[1];
            this.deferred[1] = new Deferred();
            return x;
        });
    }
}
export default KopiCoroutine;
