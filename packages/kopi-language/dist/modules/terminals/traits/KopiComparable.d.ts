import { KopiValue, KopiTrait } from '../../shared.js';
import { KopiNumber } from '../../terminals/classes/index.js';
declare abstract class Comparable extends KopiTrait {
    abstract compare(this: Comparable, that: KopiValue): KopiNumber;
    '<'(this: Comparable, that: KopiValue): KopiValue;
    '>'(this: Comparable, that: KopiValue): KopiValue;
    '<='(this: Comparable, that: KopiValue): KopiValue;
    '>='(this: Comparable, that: KopiValue): KopiValue;
}
export default Comparable;
