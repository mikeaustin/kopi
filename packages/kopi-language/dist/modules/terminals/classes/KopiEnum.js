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
import KopiBoolean from './KopiBoolean.js';
import KopiString from './KopiString.js';
import KopiTuple from './KopiTuple.js';
class KopiEnumField extends KopiValue {
    constructor(_enum, index, name, value) {
        super();
        this._enum = _enum;
        this._index = index;
        this.name = name;
        this.value = value;
    }
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return `EnumField (name: ${yield this.name.inspect()}, value: ${yield this.value.inspect()})`;
        });
    }
    ['=='](that) {
        return new KopiBoolean(this.value === that.value);
    }
    succ() {
        return this._enum._fields[this._index + 1];
    }
}
class KopiEnum extends KopiValue {
    constructor(fields, fieldNames) {
        super();
        this._fields = fields.map((field, index) => {
            var _a, _b;
            return (new KopiEnumField(this, index, new KopiString((_a = fieldNames === null || fieldNames === void 0 ? void 0 : fieldNames[index]) !== null && _a !== void 0 ? _a : ''), (_b = fields[index]) !== null && _b !== void 0 ? _b : KopiTuple.empty));
        });
        this.fieldNames = fieldNames !== null && fieldNames !== void 0 ? fieldNames : [];
        this._fields.forEach((field, index) => {
            var _a;
            this[index] = field;
            this[(_a = this.fieldNames[index]) !== null && _a !== void 0 ? _a : ''] = field;
        });
    }
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            return `Enum`;
        });
    }
}
export default KopiEnum;
