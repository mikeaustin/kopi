var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addTraits, KopiValue } from '../../shared.js';
import KopiIterable from '../traits/KopiIterable.js';
import KopiTuple from './KopiTuple.js';
import KopiNumber from './KopiNumber.js';
import KopiBoolean from './KopiBoolean.js';
class KopiDict extends KopiValue {
    constructor(entries) {
        super();
        this.entries = new Map(entries.map(([key, value]) => [key.valueOf(), [key, value]]));
    }
    toString() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.entries.size === 0) {
                return `{:}`;
            }
            const entries = yield Promise.all((Array.from(this.entries)).map(([key, [_, value]]) => __awaiter(this, void 0, void 0, function* () { return `${key}: ${yield (yield value).inspect()}`; })));
            return `{ ${entries.join(', ')} }`;
        });
    }
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.toString();
        });
    }
    toJS() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([...this.entries].map(([key, [_, value]]) => __awaiter(this, void 0, void 0, function* () { return [key, (yield value).toJS()]; })));
        });
    }
    *[Symbol.asyncIterator]() {
        for (const [_, [key, value]] of this.entries) {
            yield new KopiTuple([Promise.resolve(key), value]);
        }
    }
    size() {
        return __awaiter(this, void 0, void 0, function* () {
            return new KopiNumber(this.entries.size);
        });
    }
    get(key) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [_, value] = (_a = this.entries.get(key.valueOf())) !== null && _a !== void 0 ? _a : [key, KopiTuple.empty];
            return value;
        });
    }
    set(key) {
        return (value) => __awaiter(this, void 0, void 0, function* () {
            const map = new Map(this.entries);
            map.set(key.valueOf(), [key, Promise.resolve(value)]);
            return new KopiDict([...map.entries()].map(([_, [key, value]]) => [key, value]));
        });
    }
    delete(key) {
        const map = new Map(this.entries);
        map.delete(key.valueOf());
        return new KopiDict([...map.entries()].map(([_, [key, value]]) => [key, value]));
    }
    has(key) {
        return new KopiBoolean(this.entries.has(key.valueOf()));
    }
    merge(that) {
        const map = new Map([...this.entries, ...that.entries]);
        return new KopiDict([...map.entries()].map(([_, [key, value]]) => [key, value]));
    }
    update(key, context) {
        return (func) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const [_, value] = (_a = this.entries.get(key.valueOf())) !== null && _a !== void 0 ? _a : [key, KopiTuple.empty];
            const updatedValue = func.apply(KopiTuple.empty, [yield value, context]);
            const map = new Map(this.entries);
            map.set(key.valueOf(), [key, Promise.resolve(updatedValue)]);
            return new KopiDict([...map.entries()].map(([_, [key, value]]) => [key, value]));
        });
    }
}
KopiDict.empty = new KopiDict([]);
addTraits([KopiIterable], KopiDict);
export default KopiDict;
