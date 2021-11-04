const util = require('util');
const fs = require('fs');

const { KopiString, KopiDict } = require('../src/classes');

const kopi_ls = {
  async inspectAsync() {
    const dir = await util.promisify(fs.readdir)('.');

    return dir.map((filename) => new KopiString(filename)).inspectAsync({ formatted: true });
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
              date: new KopiString(formattedDate + ' ' + formattedTime)
            }).map(([key, value]) => [new KopiString(key), value])
          ));
        }

        return files.inspectAsync({ formatted: true });
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
                date: new KopiString(formattedDate + ' ' + formattedTime)
              }).map(([key, value]) => [new KopiString(key), value])
            ).inspectAsync();
          }
        };
      }
    };
  }
};

module.exports = {
  default: kopi_ls
};
