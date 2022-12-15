import { KopiCollection, KopiValue } from '../../shared.js';
import KopiString from './KopiString.js';
declare const KopiStream2: (collection: KopiCollection) => {
    new (iterable: AsyncIterable<KopiValue>): {
        readonly iterable: AsyncIterable<KopiValue>;
        inspect(): Promise<string>;
        [Symbol.asyncIterator](): AsyncIterator<KopiValue, any, undefined>;
        readonly fields: Promise<KopiValue>[];
        toJS(): Promise<any>;
        invoke(methodName: string, [argument, context]: [KopiValue, import("../../shared.js").Context]): Promise<KopiValue>;
    };
    readonly emptyValue: () => KopiString;
    traits: import("../../shared.js").KopiTrait[];
};
declare class KopiStream extends KopiValue {
    static readonly emptyValue: () => KopiString;
    readonly iterable: AsyncIterable<KopiValue>;
    constructor(iterable: AsyncIterable<KopiValue>);
    inspect(): Promise<string>;
    [Symbol.asyncIterator](): AsyncIterator<KopiValue, any, undefined>;
}
export default KopiStream;
export { KopiStream2 };
