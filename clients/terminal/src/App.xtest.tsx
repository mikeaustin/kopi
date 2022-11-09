import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';
import * as parser from './lib/parser';
import { evaluate } from './compiler';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
