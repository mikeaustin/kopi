import { Context, KopiValue } from '../../shared.js';
import KopiTuple from './KopiTuple.js';
import KopiNumber from './KopiNumber.js';
import KopiFunction from './KopiFunction.js';
import KopiBoolean from './KopiBoolean.js';
declare class KopiDict extends KopiValue {
    static readonly empty: KopiDict;
    readonly entries: Map<any, [KopiValue, Promise<KopiValue>]>;
    constructor(entries: [key: KopiValue, value: Promise<KopiValue>][]);
    toString(): Promise<string>;
    inspect(): Promise<string>;
    toJS(): Promise<any[][]>;
    [Symbol.asyncIterator](): Generator<KopiTuple, void, unknown>;
    size(): Promise<KopiNumber>;
    get(key: KopiValue): Promise<KopiValue>;
    set(key: KopiValue): (value: Promise<KopiValue>) => Promise<KopiDict>;
    delete(key: KopiValue): KopiDict;
    has(key: KopiValue): KopiBoolean;
    merge(that: KopiDict): KopiDict;
    update(key: KopiValue, context: Context): (func: KopiFunction) => Promise<KopiDict>;
}
export default KopiDict;
