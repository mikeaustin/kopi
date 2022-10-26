import * as parser from './lib/parser';
import { transform, evaluate } from './test';

test('foo', async () => {
  let ast = parser.parse('1');
  let value = await evaluate(transform(ast), {});

  console.log(value);

  expect(value).toEqual({
    value: 1
  });

  ast = parser.parse('(sleep (sleep 1) + sleep (sleep 1), sleep 1 + sleep 1)');
  value = await evaluate(transform(ast), {});

  console.log(value);

  // expect(value).toEqual({
  //   value: 1
  // });
});
