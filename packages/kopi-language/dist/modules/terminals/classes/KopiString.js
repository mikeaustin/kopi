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
import { addTraits, KopiValue, KopiCollection, KopiEnumerable, KopiApplicative } from '../../shared.js';
import Comparable from '../traits/KopiComparable.js';
import KopiIterable from '../traits/KopiIterable.js';
import KopiArray from './KopiArray.js';
import KopiNumber from './KopiNumber.js';
import KopiTuple from './KopiTuple.js';
import KopiBoolean from './KopiBoolean.js';
import KopiRange from './KopiRange.js';
class KopiString extends KopiValue {
    // static [Symbol.hasInstance](instance: KopiStringWithoutIterator) {
    //   return instance instanceof KopiString;
    // }
    //
    constructor(value, withIterator = true) {
        super();
        this.value = value;
    }
    // @ts-ignore
    static inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return `String`;
        });
    }
    // Core methods
    valueOf() {
        return this.value;
    }
    toString() {
        return __awaiter(this, void 0, void 0, function* () {
            return `${this.value}`;
        });
    }
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return `"${yield this.toString()}"`;
        });
    }
    toJS() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.value;
        });
    }
    [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
            for (const value of this.value) {
                yield yield __await(new KopiString(value));
            }
        });
    }
    size() {
        return new KopiNumber(this.value.length);
    }
    apply(thisArg, [argument]) {
        return __awaiter(this, void 0, void 0, function* () {
            if (argument instanceof KopiArray) {
                const accum = [];
                const indices = argument;
                const array = [...this.value];
                for (const index of indices.elements) {
                    accum.push(array[(yield index).value]);
                }
                return new KopiString(accum.join(''));
            }
            if (argument instanceof KopiRange) {
                const range = argument;
                const from = range.from;
                const to = range.to;
                const array = [...this.value].slice(from.value > to.value ? to.value : from.value, to.value < from.value ? from.value : to.value);
                if (from.value > to.value) {
                    array.reverse();
                }
                return new KopiString(array.join(''));
            }
            if (argument instanceof KopiNumber) {
                const index = argument;
                const codePoint = this.value.codePointAt(index.value);
                if (codePoint) {
                    return new KopiString(String.fromCodePoint(codePoint));
                }
            }
            throw new Error('Invalid codePoint');
        });
    }
    set(argument) {
        return (value) => {
            const array = [...this.value];
            const start = argument instanceof KopiRange ? argument.from : argument;
            const end = argument instanceof KopiRange ? argument.to : new KopiNumber(argument.value + 1);
            // const deleteCount = to.value - from.value;
            // array.splice(from.value, deleteCount, value.value);
            // return new KopiString(
            //   array.join('')
            // );
            return new KopiString(array
                .slice(0, start.value)
                .concat(value.value)
                .concat(array.slice(end.value, Infinity))
                .join(''));
        };
    }
    update(index, context) {
        return (func) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const array = [...this.value];
            const value = (_a = array[index.value]) !== null && _a !== void 0 ? _a : '';
            const updatedValue = (yield func.apply(KopiTuple.empty, [new KopiString(value), context])).value;
            array.splice(index.value, 1, updatedValue);
            return new KopiString(array.join(''));
        });
    }
    remove(index) {
        const array = [...this.value];
        return new KopiString(array
            .slice(0, index.value)
            .concat(array.slice(index.value + 1, Infinity))
            .join(''));
    }
    getTuple(tuple) {
        return __awaiter(this, void 0, void 0, function* () {
            const arg = yield tuple.fields[0];
            const value = yield tuple.fields[1];
            if (arg instanceof KopiRange) {
                const range = arg;
                const array = [...this.value];
                return new KopiString(array
                    .slice(0, range.from.value)
                    .concat(value.value)
                    .concat(array.slice(range.to.value, Infinity))
                    .join(''));
            }
            if (arg instanceof KopiNumber) {
                const index = arg;
                const array = [...this.value];
                return new KopiString(array
                    .slice(0, index.value)
                    .concat(value.value)
                    .concat(array.slice(index.value + 1, Infinity))
                    .join(''));
            }
            throw new Error('');
        });
    }
    get(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (arg instanceof KopiTuple) {
                return this.getTuple(arg);
            }
            if (arg instanceof KopiArray) {
                const accum = [];
                const indices = arg;
                const array = [...this.value];
                for (const index of indices.elements) {
                    accum.push(array[(yield index).value]);
                }
                return new KopiString(accum.join(''));
            }
            if (arg instanceof KopiRange) {
                const range = arg;
                const array = [...this.value];
                return new KopiString(array.slice(range.from.value, range.to.value).join(''));
            }
            if (arg instanceof KopiNumber) {
                const index = arg;
                const codePoint = this.value.codePointAt(index.value);
                if (codePoint) {
                    return new KopiString(String.fromCodePoint(codePoint));
                }
            }
            throw new Error('Invalid codePoint');
        });
    }
    append(that) {
        return new KopiString(this.value + that.value);
    }
    '++'(that) {
        return new KopiString(this.value.concat(that.value));
    }
    toUpperCase() {
        return new KopiString(this.value.toLocaleUpperCase());
    }
    // Enumerable methods
    succ(count) {
        if (count === KopiTuple.empty) {
            count = new KopiNumber(1);
        }
        if (count instanceof KopiNumber) {
            const codePoint = this.value.codePointAt(0);
            if (codePoint) {
                return new KopiString(String.fromCodePoint(codePoint + count.value));
            }
        }
        throw new Error('KopiString.succ()');
    }
    // Comparable methods
    '=='(that) {
        return new KopiBoolean(this.value === that.value);
    }
    compare(that) {
        if (this.value < that.value) {
            return new KopiNumber(-1);
        }
        else if (this.value > that.value) {
            return new KopiNumber(+1);
        }
        return new KopiNumber(0);
    }
    // General methods
    split(string) {
        return new KopiArray(this.value.split(string.value).map(string => new KopiString(string)));
    }
    trim(string) {
        return new KopiString(this.value.trim());
    }
}
KopiString.emptyValue = () => new KopiString('');
KopiString.newlineRegExp = new KopiString(/\n/);
addTraits([KopiEnumerable, Comparable, KopiIterable, KopiCollection, KopiApplicative], KopiString);
export default KopiString;
