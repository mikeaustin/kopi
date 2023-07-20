var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import { addTraits, KopiValue } from '../../../modules/shared.js';
import { KopiArray } from '../../../modules/terminals/classes/index.js';
import { Deferred } from '../../../modules/utils.js';
import KopiIterable from '../traits/KopiIterable.js';
class KopiSubject extends KopiValue {
    constructor(value) {
        super();
        this.promise = new Deferred();
    }
    set(value) {
        console.log('KopiObserver.set');
        this.promise.resolve(value);
        this.promise = new Deferred();
        return this;
    }
    [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
            while (true) {
                yield yield __await(this.promise);
            }
        });
    }
}
KopiSubject.emptyValue = () => new KopiArray([]);
addTraits([KopiIterable], KopiSubject);
export default KopiSubject;
