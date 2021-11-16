import fs from 'fs';
import http from 'http';
import fetch from 'node-fetch';

import { KopiString, KopiTuple } from '../classes.mjs';

import * as coroutines from './coroutines.mjs';

import kopi_ls from '../../test/terminal.mjs';

const kopi_read = async (filename) => {
  return new KopiString(await fs.promises.readFile(filename.getNativeString(), 'utf8'));
};

const kopi_fetch = async (url) => {
  const request = await fetch(url.getNativeString());

  return new KopiString(await request.text());
};

const kopi_listen = (port) => (co) => http.createServer(async (request, response) => {
  const value = await coroutines.kopi_send(co)(request);

  response.writeHead(200);
  response.end(value);
}).listen({
  port: port,
});

const kopi_spawn = coroutines.kopi_spawn;
const kopi_yield = coroutines.kopi_yield;
const kopi_send = coroutines.kopi_send;
const kopi_tasks = coroutines.kopi_tasks;

export {
  kopi_ls,
  kopi_read,
  kopi_fetch,
  kopi_listen,
  kopi_spawn,
  kopi_yield,
  kopi_send,
  kopi_tasks,
};
