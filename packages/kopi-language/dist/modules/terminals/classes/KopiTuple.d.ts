import { Context, KopiValue } from '../../shared.js';
import KopiBoolean from './KopiBoolean.js';
import KopiFunction from './KopiFunction.js';
import KopiStream from './KopiStream.js';
declare class KopiTuple extends KopiValue {
    static readonly empty: KopiTuple;
    readonly _fields: Promise<KopiValue>[];
    readonly fieldNames: (string | null)[];
    static create(tuple: KopiTuple): KopiTuple;
    constructor(fields: Promise<KopiValue>[], fieldNames?: (string | null)[], isEmpty?: boolean);
    get fields(): Promise<KopiValue>[];
    toString(): Promise<string>;
    inspect(): Promise<string>;
    '=='(that: KopiTuple, context: Context): Promise<KopiBoolean>;
    map(func: KopiFunction, context: Context): KopiStream;
    reduce(func: KopiFunction, context: Context): Promise<KopiValue>;
}
export default KopiTuple;
