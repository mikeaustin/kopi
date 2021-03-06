import { parse } from '../lib/parser';

import TypecheckVisitors from './visitors/TypecheckVisitors';
import InterpreterVisitors from './visitors/InterpreterVisitors';

import initialContext from '../bin/context';
import initialScope from '../bin/scope';

const history = document.querySelector('.history');
const line = document.querySelector('.line');

const exampleClick = (event) => {
  if (event.target.innerText) {
    line.value = event.target.innerText;
    line.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  }
};

const examples = document.querySelectorAll('.examples div');
examples.forEach(example => {
  example.addEventListener('click', exampleClick);
});

line.focus();

const typecheckVisitors = new TypecheckVisitors.default();

const visitors = new InterpreterVisitors.default();

const inspect = value => {
  if (typeof value === 'object') {
    const props = Object.entries(value).map(([name, value]) => `${name}: ${inspect(value)}`);

    return `${value.constructor.name} { ${props.join(', ')} }`;
  } else if (typeof value === 'string') {
    return `"${value}"`;
  } else if (typeof value === 'number') {
    return `${value}`;
  }
};

//

let context = initialContext.default;
let scope = initialScope.default;

Object.entries(scope).forEach(([name, value]) => {
  if (context[name]?.params) {
    value.params = context[name].params;
    value.rettype = context[name].rettype;
    value.type = context[name];
  }
});

const bindTypes = types => context = { ...context, ...types };
const bind = variables => scope = { ...scope, ...variables };

line.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    if (event.target.value === '') {
      return;
    }

    const ast = parse(event.target.value);

    console.log(ast);

    const div1 = document.createElement('div');
    div1.textContent = `> ${event.target.value}`;

    history.appendChild(div1);

    try {
      const type = typecheckVisitors.visitNode(ast, context, bindTypes);
      const value = visitors.visitNode(ast, scope, bind);

      if (value !== undefined) {
        const div = document.createElement('div');

        if (value.toElement) {
          div.appendChild(value.toElement());
        } else {
          div.textContent = `${value.escape()} :: ${type?.escape()}`;
        }

        history.appendChild(div);
      }
    } catch (error) {
      console.error(error);

      const div = document.createElement('div');
      div.textContent = error;

      history.appendChild(div);
    }

    line.value = '';
  }
});
