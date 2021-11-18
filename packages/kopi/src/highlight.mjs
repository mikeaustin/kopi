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
        * {
          font: 14px/1.5em 'Menlo', monospace;
        }

        block, statement {
          display: block;
        }

        parentheses-expression::before {
          content: '(';
        }

        parentheses-expression::after {
          content: ')';
        }

        apply-expression > identifier {
          font-weight: bold;
        }

        numeric-literal {
          color: red;
        }
      </style>` +
      Highlighter.visitNode(astRootNode, 0),
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
