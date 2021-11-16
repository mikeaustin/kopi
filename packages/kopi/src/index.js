import parser from '../lib/parser';
import interpreter from './visitors/Interpreter.mjs';
import getScope from './scope.mjs';

const scope = getScope(null);

const compile = async (sourceElement, outputElement) => {
  try {
    outputElement.innerHTML = '';

    const astRootNode = parser.parse(sourceElement.value.trim());
    await interpreter.visitNode(astRootNode, scope);
  } catch (error) {
    console.error(error);

    outputElement.innerHTML = error.message;
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  const sourceElement = document.querySelector('#source textarea');
  const outputElement = document.querySelector('#output');

  const source = await (await fetch('examples/basics.kopi')).text();

  sourceElement.value = source;

  const _log = console.log;
  console.log = (...args) => {
    _log(...args);

    outputElement.innerHTML += args.map((arg) => arg.toString()).join(' ') + '<br />';
  };

  compile(sourceElement, outputElement);

  sourceElement.addEventListener('change', async () => {
    compile(sourceElement, outputElement);
  });

  sourceElement.addEventListener('input', async () => {
    compile(sourceElement, outputElement);
  });
});
