import { KopiValue, KopiTrait } from '../../shared';
import { KopiBoolean, KopiNumber } from '../../terminals/classes';

abstract class Comparable extends KopiTrait {
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
