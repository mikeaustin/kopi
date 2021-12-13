import KopiArray from './KopiArray.mjs';
import KopiSequence from './KopiSequence.mjs';

class KopiTuple {
  constructor(fieldsArray = [], fieldNamesArray = []) {
    if (fieldsArray === null) {
      this._fieldsArray = [];
      this._fieldNamesArray = [];

      return this;
    }

    if (this.constructor === KopiTuple && fieldsArray.length === 0) {
      console.log('Use KopiTuple.empty instead of calling KopiTuple([]).');

      return KopiTuple.empty;
    }

    fieldsArray.forEach((field, index) => {
      this[index] = field;
      this[fieldNamesArray[index]] = field;
    });

    this._fieldsArray = fieldsArray;
    this._fieldNamesArray = fieldNamesArray;
  }

  async inspectAsync() {
    if (this === KopiTuple.empty) {
      return '()';
    }

    const fieldsArray = await Promise.all(
      this._fieldsArray.map(async (field) => (await (await field).inspectAsync())),
    );

    const typeName = this.constructor.name !== 'KopiTuple' ? `${this.constructor.name} ` : '';

    return `${typeName}(${fieldsArray.map((field, index) => (
      `${this._fieldNamesArray[index] ? `${this._fieldNamesArray[index]}: ` : ''}${field}`
    )).join(', ')})`;
  }

  async toStringAsync() {
    return this.inspectAsync();
  }

  getFieldsArray() {
    return this._fieldsArray;
  }

  getFieldAtIndex(index) {
    return this._fieldsArray[index];
  }

  getFieldNamesArray() {
    return this._fieldNamesArray;
  }

  getFieldNameAtIndex(index) {
    return this._fieldNamesArray[index];
  }

  getIndexOfFieldName(fieldName) {
    return this._fieldNamesArray.indexOf(fieldName);
  }

  getFieldWithName(fieldName) {
    return this._fieldsArray[this._fieldNamesArray.indexOf(fieldName)];
  }

  async hasErrors() {
    for await (const field of this._fieldsArray) {
      if (field.constructor.name === 'Error') {
        return true;
      }
    }

    return false;
  }

  async errors() {
    const messages = [];

    for await (const field of this._fieldsArray) {
      if (field.constructor.name === 'Error') {
        messages.push(field.message);
      }
    }

    return new KopiArray(messages);
  }

  async ['=='](that) {
    if (!(that instanceof KopiTuple)) {
      return false;
    }

    // TODO: Optimization for numbers

    for (const [index, field] of this._fieldsArray.entries()) {
      if (!await (await field)['=='](await that._fieldsArray[index])) {
        return false;
      }
    }

    return true;
  }

  async ['!='](that) {
    return !await this['=='](that);
  }

  async map(mapper, scope, visitors) {
    const iters = this._fieldsArray.map((field) => field[Symbol.iterator]());
    const values = [];

    let results = iters.map((iter) => iter.next());

    while (results.every((result) => !result.done)) {
      const predicatePassed = !(mapper?.params?.predicate && !await visitors.visitNode(mapper.params.predicate, {
        ...scope,
        ...await mapper.params.getMatches(new KopiTuple(results.map((result) => result.value))),
      }));

      if (predicatePassed) {
        values.push(
          mapper.apply(undefined, [new KopiTuple(results.map((result) => result.value)), scope, visitors]),
        );
      }

      results = iters.map((iter) => iter.next());
    }

    return new KopiArray(await Promise.all(values));
  }

  async map2(mapper, scope, visitors) {
    return new KopiSequence((async function* map() {
      const iters = this._fieldsArray.map((field) => field[Symbol.iterator]());

      let results = iters.map((iter) => iter.next());

      while (results.every((result) => !result.done)) {
        yield mapper.apply(undefined, [new KopiTuple(results.map((result) => result.value)), scope, visitors]);

        results = iters.map((iter) => iter.next());
      }
    }).apply(this));
  }

  async product(func, scope, visitors) {
    if (func === KopiTuple.empty) {
      func = (args) => args, scope, visitors;
    }

    const helper = async (index, values) => {
      const iter = this._fieldsArray[index][Symbol.iterator]();
      const accum = [];

      let result = iter.next();

      while (!result.done) {
        if (index === this._fieldsArray.length - 1) {
          accum.push(await func.apply(undefined, [new KopiTuple([...values, result.value]), scope, visitors]));
        } else {
          accum.push(...await helper(index + 1, [...values, result.value]));
        }

        result = iter.next();
      }

      return new KopiArray(accum);
    };

    return helper(0, []);
  }
}

KopiTuple.empty = new KopiTuple(null);

export default KopiTuple;
