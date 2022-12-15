var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addTraits, KopiValue, KopiNumeric, KopiEquatable, KopiEnumerable } from '../../shared.js';
import Comparable from '../traits/KopiComparable.js';
import KopiString from './KopiString.js';
import KopiBoolean from './KopiBoolean.js';
import KopiTuple from './KopiTuple.js';
class KopiNumber extends KopiValue {
    //
    constructor(value) {
        super();
        this.value = value;
    }
    // @ts-ignore
    static inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return `Number`;
        });
    }
    static from(value) {
        if (value instanceof KopiString) {
            return new KopiNumber(Number(value.value));
        }
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
            return this.toString();
        });
    }
    toJS() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.value;
        });
    }
    // KopiNumeric methods
    '+'(that) {
        return new KopiNumber(this.value + that.value);
    }
    '-'(that) {
        return new KopiNumber(this.value - that.value);
    }
    '*'(that) {
        return new KopiNumber(this.value * that.value);
    }
    '/'(that) {
        return new KopiNumber(this.value / that.value);
    }
    '%'(that) {
        return new KopiNumber(this.value % that.value);
    }
    negate() {
        return new KopiNumber(-this.value);
    }
    // Enumerable methods
    succ(count) {
        if (count instanceof KopiTuple && count.fields.length === 0) {
            count = new KopiNumber(1);
        }
        return new KopiNumber(this.value + count.value);
    }
    // Comparable methods
    '=='(that) {
        return new KopiBoolean(this.value === that.value);
    }
    '!='(that) {
        return new KopiBoolean(this.value !== that.value);
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
    even() {
        return new KopiBoolean(this.value % 2 === 0);
    }
    odd() {
        return new KopiBoolean(this.value % 2 !== 0);
    }
    round() {
        return new KopiNumber(Math.round(this.value));
    }
    sin() {
        return new KopiNumber(Math.sin(this.value));
    }
    cos() {
        return new KopiNumber(Math.cos(this.value));
    }
    toFixed(digits) {
        return new KopiString(this.value.toFixed(digits.value));
    }
    test(a) {
        return (b) => new KopiNumber((this.value + a.value) * b.value);
    }
}
KopiNumber.PI = new KopiNumber(Math.PI);
KopiNumber.E = new KopiNumber(Math.E);
addTraits([KopiNumeric, KopiEquatable, KopiEnumerable, Comparable], KopiNumber);
export default KopiNumber;
