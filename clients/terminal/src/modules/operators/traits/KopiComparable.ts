import { KopiValue, Trait } from '../../shared';
import { KopiBoolean, KopiNumber } from '../../terminals/classes';

abstract class Comparable extends Trait {
  abstract compare(this: Comparable, that: KopiValue): KopiNumber;

  '<'(this: Comparable, that: KopiValue): KopiValue {
    return new KopiBoolean(this.compare(that).value < 0);
  }

  '>'(this: Comparable, that: KopiValue): KopiValue {
    return new KopiBoolean(this.compare(that).value > 0);
  }

  '<='(this: Comparable, that: KopiValue): KopiValue {
    return new KopiBoolean(this.compare(that).value <= 0);
  }

  '>='(this: Comparable, that: KopiValue): KopiValue {
    return new KopiBoolean(this.compare(that).value >= 0);
  }
}

export default Comparable;
