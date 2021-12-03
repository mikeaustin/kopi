import readline from 'readline';
// const { Worker } = require('worker_threads');

import { KopiString, KopiTuple, KopiArray, KopiDict, KopiVector } from './classes.mjs';

import * as node from './functions/node.mjs';
import { compile } from './compiler.mjs';

import kopi_ls from '../test/terminal.mjs';

const KopiStringConstructor = (value) => new KopiString(value.toStringAsync());
KopiStringConstructor.nativeConstructor = KopiString;
KopiStringConstructor.Newline = new KopiString('\n');
KopiStringConstructor.NewlineRegExp = new KopiString(/\r?\n/);

const KopiArrayConstructor = (tuple) => new KopiArray(tuple.getElementsArray());
KopiArrayConstructor.nativeConstructor = KopiArray;

const KopiDictConstructor = async (entries) => new KopiDict(
  await Promise.all(entries.getElementsArray().map(async (entry) => (await entry).getElementsArray())),
);
KopiDictConstructor.nativeConstructor = KopiDict;

Number.nativeConstructor = Number;
String.nativeConstructor = String;

// class KopiWorker {
//   constructor(filename) {
//     this.filename = filename;
//     this.worker = new Worker('./src/worker.js', {
//       workerData: filename,
//     });
//   }
// }

globalThis.methods = [new Map()];

let getScope = (input) => ({
  ls: kopi_ls,
  // worker: (filename) => {
  //   return new KopiWorker(filename);
  // },
  read: node.kopi_read,
  fetch: node.kopi_fetch,
  import: (filename, scope) => compile(filename.getNativeString(), scope),
  listen: node.kopi_listen,
  exit: (code) => process.exit(code),
  spawn: node.kopi_spawn,
  yield: node.kopi_yield,
  send: node.kopi_send,
  tasks: node.kopi_tasks,
  input: (str) => {
    const rl = input ?? readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(`${str.getNativeString()} `, (data) => {
        if (rl !== input) {
          rl.close();
        }

        resolve(new KopiString(data));
      });
    });
  },
});

export default getScope;
