/*

ls 'l | map x => x.("size")

*/

import fs from 'fs';

import { KopiString, KopiTuple, KopiArray, KopiDict } from '../src/classes.mjs';
// import KopiTuple from '../src/classes/KopiTuple';

class ByteSize {
  constructor(size) {
    this.size = size;
  }

  inspectAsync() {
    return `${(this.size / 1024).toLocaleString()} B`;
  }

  toStringAsync() {
    return `${(this.size / 1024).toLocaleString()} B`;
  }

  ['+'](that) {
    return this.size + that.size;
  }
}

class Table {
  constructor(array) {
    this.array = array;
  }

  async inspectAsync() {
    const headers = (await this.array.getElementsArray()[0])._fieldsArray;
    const elements = await this.array.getElementsArray().reduce(async (elements, element) => [
      ...await elements,
      await (await element).getElementsArray().reduce(async (fields, field) => [
        ...await fields,
        await (await field).toStringAsync()
      ], [])
    ], []);

    return headers.map(header => header.padEnd(25)).join('') + '\n' + elements.reduce((elements, element) => [
      ...elements,
      element.map((field) => `${field.padEnd(25)}`).join('')
    ], []).join('\n');
  }
}

const kopi_ls = {
  async inspectAsync() {
    const dir = await fs.promises.readdir('.');

    return new KopiArray(
      dir.map((filename) => new KopiString(filename))
    ).inspectAsync({ formatted: true });
  },

  async map(func, scope, visitors) {
    const dir = await fs.promises.readdir('.');
    const files = new KopiArray(
      dir.map((filename) => new KopiString(filename))
    );

    return files.map((file) => func.apply(undefined, [file, scope, visitors]));
  },

  async size() {
    const dir = await fs.promises.readdir('.');

    return dir.length;
  },

  apply(thisArg, [args]) {
    return {
      async inspectAsync() {
        const dir = await fs.promises.opendir('./');
        const files = [];

        for await (const dirent of dir) {
          const stats = await fs.promises.stat(dirent.name);

          let formattedDate = new Date(stats.mtimeMs).toLocaleDateString();
          let formattedTime = new Date(stats.mtimeMs).toLocaleTimeString();

          files.push(new KopiDict(
            Object.entries({
              name: new KopiString(dirent.name),
              size: new ByteSize(stats.size),
              date: new KopiString(formattedDate + ' ' + formattedTime),
            }).map(([key, value]) => [new KopiString(key), value]),
          ));
        }

        return new KopiArray(files).inspectAsync({ formatted: true });
      },

      async map(func, scope, visitors) {
        const dir = await fs.promises.opendir('./');
        const files = [];

        for await (const dirent of dir) {
          const stats = await fs.promises.stat(dirent.name);

          let formattedDate = new Date(stats.mtimeMs).toLocaleDateString();
          let formattedTime = new Date(stats.mtimeMs).toLocaleTimeString();

          const entries = {
            name: new KopiString(dirent.name),
            size: new ByteSize(stats.size),
            date: new KopiString(formattedDate + ' ' + formattedTime),
          };

          files.push(new KopiTuple(
            Object.values(entries),
            Object.keys(entries),
          ));
        }

        return new Table(new KopiArray(
          files.map((file) => func.apply(undefined, [file, scope, visitors]))
        ));
      },

      apply(thisArg, [filename]) {
        return {
          async inspectAsync() {
            const stats = await fs.promises.stat(filename.getNativeString());

            let formattedDate = new Date(stats.mtimeMs).toLocaleDateString();
            let formattedTime = new Date(stats.mtimeMs).toLocaleTimeString();

            return new KopiDict(
              Object.entries({
                name: filename,
                date: new KopiString(formattedDate + ' ' + formattedTime),
              }).map(([key, value]) => [new KopiString(key), value]),
            ).inspectAsync();
          },
        };
      },
    };
  },
};

export default kopi_ls;
