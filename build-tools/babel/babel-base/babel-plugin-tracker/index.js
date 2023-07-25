// @ts-check
const generate = require("@babel/generator").default;
const { babelPlugin } = require("./plugin");

function babelPluginConsole({ types, template }, options) {
  return {
    visitor: {
      CallExpression(path, state) {
        babelPlugin({ generate, types, template }, path);
      },
    },
  };
}

module.exports = babelPluginConsole;
