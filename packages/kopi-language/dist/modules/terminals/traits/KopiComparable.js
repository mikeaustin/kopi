import { KopiTrait } from '../../shared.js';
import { KopiBoolean } from '../../terminals/classes/index.js';
class Comparable extends KopiTrait {
    '<'(that) {
        return new KopiBoolean(this.compare(that).value < 0);
    }
    '>'(that) {
        return new KopiBoolean(this.compare(that).value > 0);
    }
    '<='(that) {
        return new KopiBoolean(this.compare(that).value <= 0);
    }
    '>='(that) {
        return new KopiBoolean(this.compare(that).value >= 0);
    }
}
export default Comparable;
