var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { addTraits, KopiCollection, KopiValue } from '../../shared.js';
import KopiIterable from '../traits/KopiIterable.js';
import KopiArray from './KopiArray.js';
import KopiString from './KopiString.js';
const KopiStream2 = (collection) => {
    class KopiStream extends KopiValue {
        constructor(iterable) {
            super();
            this.iterable = iterable;
        }
        inspect() {
            var e_1, _a;
            return __awaiter(this, void 0, void 0, function* () {
                const values = [];
                try {
                    for (var _b = __asyncValues(this.iterable), _c; _c = yield _b.next(), !_c.done;) {
                        const element = _c.value;
                        values.push(Promise.resolve(element));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return new KopiArray(values).inspect();
            });
        }
        [Symbol.asyncIterator]() {
            return this.iterable[Symbol.asyncIterator]();
        }
    }
    KopiStream.emptyValue = () => new KopiString('');
    addTraits([KopiIterable, KopiCollection], KopiStream);
    return KopiStream;
};
class KopiStream extends KopiValue {
    constructor(iterable) {
        super();
        this.iterable = iterable;
    }
    inspect() {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const values = [];
            try {
                for (var _b = __asyncValues(this.iterable), _c; _c = yield _b.next(), !_c.done;) {
                    const element = _c.value;
                    values.push(Promise.resolve(element));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return new KopiArray(values).inspect();
        });
    }
    [Symbol.asyncIterator]() {
        return this.iterable[Symbol.asyncIterator]();
    }
}
KopiStream.emptyValue = () => new KopiString('');
addTraits([KopiIterable, KopiCollection], KopiStream);
export default KopiStream;
export { KopiStream2 };
