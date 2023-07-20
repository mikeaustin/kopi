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
import { addTraits, KopiValue, KopiCollection } from '../../shared.js';
import { KopiApplicative, KopiEnumerable } from '../../shared.js';
import { KopiArray, KopiBoolean, KopiNumber } from './index.js';
import KopiIterable from '../traits/KopiIterable.js';
import Comparable from '../traits/KopiComparable.js';
const assertTrait = (value, variableName, traits, errors) => __awaiter(void 0, void 0, void 0, function* () {
    for (const trait of traits) {
        const constructorTraits = value.constructor.traits;
        if (!constructorTraits.includes(trait)) {
            errors.push(`'${variableName}' value '${yield value.inspect()}' is missing trait '${trait.constructor.name}'`);
        }
    }
});
class KopiRange extends KopiValue {
    constructor(from, to, stride) {
        super();
        this.from = from;
        this.to = to;
        this.stride = stride !== null && stride !== void 0 ? stride : new KopiNumber(1);
    }
    toString() {
        return __awaiter(this, void 0, void 0, function* () {
            return `${yield (yield this.from).inspect()}..${yield (yield this.to).inspect()}`;
        });
    }
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return `${yield (yield this.from).inspect()}..${yield (yield this.to).inspect()}`;
        });
    }
    '=='(that, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield that.from.invoke('==', [this.from, context])).value) {
                return new KopiBoolean(false);
            }
            ;
            if (!(yield that.to.invoke('==', [this.to, context])).value) {
                return new KopiBoolean(false);
            }
            ;
            if (!(yield that.stride.invoke('==', [this.stride, context])).value) {
                return new KopiBoolean(false);
            }
            ;
            return new KopiBoolean(true);
        });
    }
    // Applicatie methods
    apply(thisArg, [by]) {
        return __awaiter(this, void 0, void 0, function* () {
            return new KopiRange(this.from, this.to, by);
        });
    }
    // Iterator methods
    *iterator() {
        let errors = [];
        assertTrait(this.from, 'from', [KopiEnumerable, Comparable], errors);
        assertTrait(this.to, 'to', [KopiEnumerable, Comparable], errors);
        if (errors.length > 0) {
            throw new Error(`Range.iterator(): 'from' or 'to' values are missing traits:\n${errors.join('\n')}`);
        }
        for (let current = this.from; current['<='].apply(current, [this.to]).value; current = current.succ(this.stride)) {
            yield current;
        }
    }
    [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
            let errors = [];
            assertTrait(this.from, 'from', [KopiEnumerable, Comparable], errors);
            assertTrait(this.to, 'to', [KopiEnumerable, Comparable], errors);
            if (errors.length > 0) {
                throw new Error(`Range.iterator(): 'from' or 'to' values are missing traits:\n${errors.join('\n')}`);
            }
            for (let current = this.from; current['<='].apply(current, [this.to]).value; current = current.succ(this.stride)) {
                yield yield __await(current);
            }
        });
    }
}
KopiRange.emptyValue = () => new KopiArray([]);
addTraits([KopiIterable, KopiCollection, KopiApplicative], KopiRange);
export default KopiRange;
