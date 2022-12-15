var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addTraits, KopiValue, KopiCollection, KopiApplicative } from '../../shared.js';
import KopiIterable from '../traits/KopiIterable.js';
import KopiNumber from './KopiNumber.js';
import KopiBoolean from './KopiBoolean.js';
import KopiRange from './KopiRange.js';
import KopiTuple from './KopiTuple.js';
import KopiString from './KopiString.js';
class KopiArray extends KopiValue {
    constructor(elements) {
        super();
        this.elements = elements;
        this.allResolved = !elements.every(element => element instanceof Promise);
        Promise.all(elements).then(resolvedElements => {
            this.elements = resolvedElements;
            this.allResolved = true;
        });
    }
    toString() {
        return __awaiter(this, void 0, void 0, function* () {
            const elements = yield Promise.all(this.elements.map((element) => __awaiter(this, void 0, void 0, function* () { return (yield element).inspect(); })));
            return `[${elements.join(', ')}]`;
        });
    }
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.toString();
        });
    }
    toJS() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.elements.map((element) => __awaiter(this, void 0, void 0, function* () { return (yield element).toJS(); })));
        });
    }
    size() {
        return new KopiNumber(this.elements.length);
    }
    '++'(that) {
        return new KopiArray(this.elements.concat(that.elements));
    }
    apply(thisArg, [argument]) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (argument instanceof KopiArray) {
                const indices = argument;
                const accum = [];
                for (const index of indices.elements) {
                    const value = (_a = this.elements[(yield index).value]) !== null && _a !== void 0 ? _a : KopiTuple.empty;
                    accum.push(value);
                }
                return new KopiArray(accum);
            }
            if (argument instanceof KopiRange) {
                const range = argument;
                return new KopiArray(this.elements.slice(range.from.value, range.to.value));
            }
            if (argument instanceof KopiNumber) {
                const index = argument;
                return (_b = yield this.elements[index.value]) !== null && _b !== void 0 ? _b : KopiTuple.empty;
            }
        });
    }
    has(index) {
        return new KopiBoolean(index.value >= 0 && index.value < this.elements.length);
    }
    get(index) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = yield this.elements[index.value]) !== null && _a !== void 0 ? _a : KopiTuple.empty;
        });
    }
    // TODO: Can't be done with this.elements.includes() since Array stores promises
    // includes(value: KopiValue) {
    //   if (this.allResolved) {
    //     return this.elements.includes(value)
    //   }
    // }
    // TODO: Don't resolve promises for arguments, since they may not need to be
    // Or, pass in values via a tuple or array to keep their promise
    set(index) {
        return (value) => {
            if (index instanceof KopiRange) {
                const elements = [...this.elements];
                const deleteCount = index.to.value - index.from.value + 1;
                elements.splice(index.from.value, deleteCount, value);
                return new KopiArray(elements);
            }
            else if (index instanceof KopiNumber) {
                const elements = [...this.elements];
                elements[index.value] = value;
                return new KopiArray(elements);
            }
        };
    }
    remove(index) {
        return new KopiArray(this.elements
            .slice(0, index.value)
            .concat(this.elements.slice(index.value + 1, Infinity)));
    }
    update(index) {
        return (func, context) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const elements = [...this.elements];
            const value = (_a = elements[index.value]) !== null && _a !== void 0 ? _a : Promise.resolve(KopiTuple.empty);
            elements[index.value] = func.apply(KopiTuple.empty, [yield value, context]);
            return new KopiArray(elements);
        });
    }
    '=='(that, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (that.elements.length !== this.elements.length) {
                return new KopiBoolean(false);
            }
            for (const [index, thatValue] of that.elements.entries()) {
                const thisValue = this.elements[index];
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
    *iterator() {
        for (const value of this.elements) {
            yield value;
        }
    }
    // TODO: This is not really async, but useful when you don't care about the value
    *[Symbol.asyncIterator]() {
        for (const value of this.elements) {
            yield value;
        }
    }
    append(that) {
        return new KopiArray(this.elements.concat([that]));
    }
    joinWith(separator) {
        return __awaiter(this, void 0, void 0, function* () {
            let string = new KopiString('');
            for (const [index, value] of this.elements.entries()) {
                if (index > 0) {
                    string = string.append(separator);
                }
                string = string.append(yield value);
            }
            return string;
        });
    }
}
KopiArray.emptyValue = () => new KopiArray([]);
addTraits([KopiIterable, KopiCollection, KopiApplicative], KopiArray);
export default KopiArray;
