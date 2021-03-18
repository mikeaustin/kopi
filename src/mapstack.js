const { Map, List } = require('immutable');

class Context {
  constructor() {
    this.map = Map().asMutable();
  }

  set(key, value, f) {
    this.map.update(key, (array = List().asMutable()) => array.push(value));

    f();

    this.map.update(key, array => array.pop());
  }

  get(key) {
    return this.map.get(key).last();
  }
}

const context = new Context();


const parent = () => {
  context.set('x', 5, () => {
    child();
  });
};

const child = () => {
  console.log('>', context.get('x'));
};

parent();



class Context2 {
  constructor() {
    this.list = List().asMutable();
  }

  set(value, f) {
    this.list = this.list.push(value);

    f();

    this.list = this.list.pop(value);
  }

  get() {
    return this.list.last();
  }
}

const context2 = new Context2();

context2.set({
  x: 100
}, () => {
  console.log(context2.get());
});
