var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import { KopiValue } from '../../shared.js';
import KopiBoolean from './KopiBoolean.js';
import KopiStream from './KopiStream.js';
class KopiTuple extends KopiValue {
    constructor(fields, fieldNames, isEmpty = false) {
        super();
        if (fields.length === 0 && !isEmpty) {
            this._fields = [];
            this.fieldNames = [];
            return KopiTuple.empty;
        }
        this._fields = fields;
        this.fieldNames = fieldNames !== null && fieldNames !== void 0 ? fieldNames : Array.from(fields, (_) => null);
        this.fieldNames.forEach((fieldName, index) => {
            this[index] = fields[index];
            if (fieldName !== null) {
                this[fieldName] = fields[index];
            }
        });
    }
    static create(tuple) {
        return new KopiTuple(tuple._fields, tuple.fieldNames);
    }
    get fields() {
        return this._fields;
    }
    toString() {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = yield Promise.all(this._fields.map((element, index) => __awaiter(this, void 0, void 0, function* () {
                return (this.fieldNames[index] !== null ? `${this.fieldNames[index]}: ` : ``) +
                    `${yield (yield element).inspect()}`;
            })));
            return `(${fields.join(', ')})`;
        });
    }
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.toString();
        });
    }
    '=='(that, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (that._fields.length !== this._fields.length) {
                return new KopiBoolean(false);
            }
            for (const [index, thatValue] of that._fields.entries()) {
                const thisValue = this._fields[index];
                if (thisValue === undefined) {
                    return new KopiBoolean(false);
                }
                if (!(yield (yield thatValue).invoke('==', [yield thisValue, context])).value) {
                    return new KopiBoolean(false);
                }
            }
            return new KopiBoolean(true);
        });
    }
    map(func, context) {
        const result = (function map() {
            return __asyncGenerator(this, arguments, function* map_1() {
                const iters = yield __await(Promise.all(this._fields.map((element) => __awaiter(this, void 0, void 0, function* () { return (yield element)[Symbol.asyncIterator](); }))));
                let results = yield __await(Promise.all(iters.map((iter) => iter.next())));
                while (results.every((result) => !result.done)) {
                    yield yield __await(func.apply(KopiTuple.empty, [new KopiTuple(results.map((result) => result.value)), context]));
                    results = yield __await(Promise.all(iters.map((iter) => iter.next())));
                }
            });
        }).apply(this);
        return new KopiStream(result);
    }
    reduce(func, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let accum = KopiTuple.empty;
            const iters = yield Promise.all(this._fields.map((element) => __awaiter(this, void 0, void 0, function* () { return (yield element)[Symbol.asyncIterator](); })));
            let results = yield Promise.all(iters.map((iter) => iter.next()));
            while (results.every((result) => !result.done)) {
                accum = yield func.apply(KopiTuple.empty, [new KopiTuple([accum, ...results.map((result) => result.value)]), context]);
                results = yield Promise.all(iters.map((iter) => iter.next()));
            }
            return accum;
        });
    }
}
KopiTuple.empty = new KopiTuple([], [], true);
export default KopiTuple;
