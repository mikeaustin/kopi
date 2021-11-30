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

  ['*'](that) {
    if (typeof that === 'number') {
      return new ByteSize(this.size * that);
    }

    return this.size * that.size;
  }
}

class Table {
  constructor(array) {
    this.array = array;
  }

  async inspectAsync() {
    const headers = (await this.array.getFieldsArray()[0]).getFieldNamesArray();
    const elements = await this.array.getFieldsArray().reduce(async (elements, element) => [
      ...await elements,
      await (await element).getFieldsArray().reduce(async (fields, field) => [
        ...await fields,
        await (await field).toStringAsync(),
      ], []),
    ], []);

    const widths = elements.reduce((widths, element) => (
      element.map((field, index) => Math.max(field.length + 2, widths[index]))
    ), Array(elements[0].length).fill(0));

    return (
      headers.map((header, index) => header.toUpperCase().padEnd(widths[index])).join('') + '\n' +
      headers.map((_, index) => '='.padEnd(widths[index] - 2, '=')).join('  ') + '\n' +
      elements.reduce((elements, element) => [
        ...elements,
        element.map((field, index) => `${field.padEnd(widths[index])}`).join(''),
      ], []).join('\n')
    );
  }
}

const kopi_ls = {
  async inspectAsync() {
    const dir = await fs.promises.readdir('.');

    return new KopiArray(
      dir.map((filename) => new KopiString(filename)),
    ).inspectAsync({ formatted: true });
  },

  async map(func, scope, visitors) {
    const dir = await fs.promises.readdir('.');
    const files = new KopiArray(
      dir.map((filename) => new KopiString(filename)),
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

        return new Table(
          new KopiArray(files),
        ).inspectAsync();
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
          files.map((file) => func.apply(undefined, [file, scope, visitors])),
        ));
      },

      apply(thisArg, [filename]) {
        return {
          async inspectAsync() {
            const stats = await fs.promises.stat(filename.getNativeString());

            let formattedDate = new Date(stats.mtimeMs).toLocaleDateString();
            let formattedTime = new Date(stats.mtimeMs).toLocaleTimeString();

            const entries = {
              name: filename,
              size: new ByteSize(stats.size),
              date: new KopiString(formattedDate + ' ' + formattedTime),
            };

            return new Table(
              new KopiArray([
                new KopiTuple(
                  Object.values(entries),
                  Object.keys(entries),
                ),
              ]),
            ).inspectAsync();
          },
        };
      },
    };
  },
};

export default kopi_ls;
