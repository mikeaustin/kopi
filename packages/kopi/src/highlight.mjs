#!/usr/bin/env node

import fs from 'fs';

import parser from '../lib/parser.js';
import Highlighter from './visitors/Highlighter.mjs';

const indent = (level) => '\n' + ''.padEnd(level * 2);

async function main() {
  const source = await fs.promises.readFile(process.argv[2], 'utf8');

  try {
    const astRootNode = parser.parse(source);

    console.log(
      `<style>
        .parentheses-expression::before {
          content: '(';
        }
        .parentheses-expression::after {
          content: ')';
        }
      </style>` +
      indent(0) + '<div>' +
      Highlighter.visitNode(astRootNode, 1) +
      indent(0) + '</div>',
    );
  } catch (error) {
    console.error(
      error.name === 'SyntaxError'
        ? `SyntaxError on line ${error.location.start.line}: ${error.message}`
        : error,
    );

    process.exit(1);
  }

}

main();
