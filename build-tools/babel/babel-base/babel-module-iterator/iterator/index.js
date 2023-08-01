const traverseModule = require("./traverseModule");
const path = require("path");
const fse = require("fs-extra");

const dependencyGraph = traverseModule(
  path.resolve(__dirname, "../test-project/index.js"),
);
fse.outputFileSync(
  path.resolve(__dirname, "../dependencyGraph.json"),
  JSON.stringify(dependencyGraph, null, 4),
);
