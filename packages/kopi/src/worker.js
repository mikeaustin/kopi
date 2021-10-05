const { compile } = require('./compiler');
const { workerData, parentPort } = require('worker_threads');

const { default: getScope } = require('./scope');

async function main() {
  let scope = getScope(null);

  await compile(workerData, scope);
}

main();
