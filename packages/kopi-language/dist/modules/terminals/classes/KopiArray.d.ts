import { KopiValue, Context } from '../../shared.js';
import KopiNumber from './KopiNumber.js';
import KopiBoolean from './KopiBoolean.js';
import KopiFunction from './KopiFunction.js';
import KopiString from './KopiString.js';
declare class KopiArray extends KopiValue {
    static readonly emptyValue: () => KopiArray;
    elements: (KopiValue | Promise<KopiValue>)[];
    allResolved: boolean;
    constructor(elements: (KopiValue | Promise<KopiValue>)[]);
    toString(): Promise<string>;
    inspect(): Promise<string>;
    toJS(): Promise<any[]>;
    size(): KopiNumber;
    '++'(that: KopiArray): KopiArray;
    apply(thisArg: KopiValue, [argument]: [KopiNumber]): Promise<KopiValue | undefined>;
    has(index: KopiNumber): KopiBoolean;
    get(index: KopiNumber): Promise<KopiValue>;
    set(index: KopiValue): (value: KopiValue) => KopiArray | undefined;
    remove(index: KopiNumber): KopiArray;
    update(index: KopiNumber): (func: KopiFunction, context: Context) => Promise<KopiArray>;
    '=='(that: KopiArray, context: Context): Promise<KopiBoolean>;
    iterator(): Generator<KopiValue | Promise<KopiValue>, void, unknown>;
    [Symbol.asyncIterator](): Generator<KopiValue | Promise<KopiValue>, void, unknown>;
    append(that: KopiValue): KopiArray;
    joinWith(separator: KopiString): Promise<KopiString>;
}
export default KopiArray;
