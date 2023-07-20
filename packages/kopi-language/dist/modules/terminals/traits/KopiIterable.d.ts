import { Context, KopiValue, KopiTrait } from '../../shared.js';
import { KopiBoolean, KopiFunction, KopiNumber, KopiArray, KopiStream, KopiDict } from '../../terminals/classes/index.js';
declare abstract class KopiIterable extends KopiTrait {
    abstract [Symbol.asyncIterator](): AsyncIterator<KopiValue>;
    toArray(): Promise<KopiArray>;
    toDict(): Promise<KopiDict>;
    reduce(func: KopiFunction, context: Context): Promise<KopiValue>;
    scan(func: KopiFunction, context: Context): Promise<KopiValue>;
    each(func: KopiFunction, context: Context): Promise<KopiValue>;
    map(func: KopiFunction, context: Context): Promise<KopiStream>;
    flatMap(func: KopiFunction, context: Context): Promise<KopiStream>;
    filter(func: KopiFunction, context: Context): Promise<KopiStream>;
    find(func: KopiFunction, context: Context): Promise<KopiValue>;
    includes(value: KopiValue, context: Context): Promise<KopiBoolean>;
    count(func: KopiFunction, context: Context): Promise<KopiNumber>;
    take(count: KopiNumber): KopiStream;
    skip(count: KopiNumber): KopiStream;
    some(func: KopiFunction, context: Context): Promise<KopiBoolean>;
    every(func: KopiFunction, context: Context): Promise<KopiBoolean>;
    cycle(): Promise<KopiStream>;
    splitOn(splitter: KopiValue, context: Context): Promise<KopiStream>;
    splitOnLimit(splitter: KopiValue, context: Context): Promise<(limit: KopiNumber) => Promise<KopiStream>>;
    splitEvery(count: KopiNumber): Promise<KopiStream>;
    sum(): Promise<KopiNumber>;
}
export default KopiIterable;
