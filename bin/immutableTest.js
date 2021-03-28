const { List, Map } = require('immutable');

// const numbers = Map([[1, 'one'], [2, 'two'], [3, 'two']]);

// result = numbers.reduce((map, value, key) => (
//   map.update(value, (list = List()) => list.push(key))
// ), new Map());

// console.log(result.toJS());

// numbers | reduce (map, [key, value]) => do
//   map | update value, (list = []) => (list | push key)
// end, {:}

// const wordCount = words => words.split(' ').reduce((map, word) => (
//   map.update(word, (value = 0) => value + 1)
// ), new Map());

// result = wordCount('a b b b c c');

// console.log(result.toJS());

// const reduce = (init);
