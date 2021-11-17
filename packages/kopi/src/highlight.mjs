#!/usr/bin/env node

import fs from 'fs';

import parser from '../lib/parser.js';
import Highlighter from './visitors/Highlighter.mjs';

async function main() {
  const source = await fs.promises.readFile(process.argv[2], 'utf8');

  try {
    const astRootNode = parser.parse(source);

    console.log(Highlighter.visitNode(astRootNode, 0));
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
