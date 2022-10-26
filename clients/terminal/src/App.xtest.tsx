import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';
import * as parser from './lib/parser';
import { evaluate } from './test';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('foo', () => {
  const ast = parser.parse('1');

  evaluate(ast, {});
});
