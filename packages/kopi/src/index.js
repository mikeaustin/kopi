import parser from '../lib/parser';
import interpreter from './visitors/Interpreter.mjs';

const scope = {};

const compile = async (sourceElement, outputElement) => {
  try {
    const astRootNode = parser.parse(sourceElement.value.trim());
    const value = await interpreter.visitNode(astRootNode, scope);

    outputElement.innerHTML = await value.inspectAsync();
  } catch (error) {
    outputElement.innerHTML = error.message;
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const sourceElement = document.querySelector('#source');
  const outputElement = document.querySelector('#output');

  compile(sourceElement, outputElement);

  sourceElement.addEventListener('input', async () => {
    compile(sourceElement, outputElement);
  });
});
