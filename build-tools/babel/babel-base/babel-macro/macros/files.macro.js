const { createMacro } = require("babel-plugin-macros");
const path = require("path");
const fs = require("fs");

module.exports = createMacro(function logMacro({ references, state, babel }) {
  const { default: referencedPaths = [] } = references;
  referencedPaths.forEach((referredPath) => {
    const dirPath = path.join(
      path.dirname(state.filename),
      referredPath.parentPath.get('arguments.0').node.value,
    );
    const fileNames = fs.readdirSync(dirPath);
    const ast = babel.types.arrayExpression(
      fileNames.map((fileName) => babel.types.stringLiteral(fileName)),
    );
    referredPath.parentPath.replaceWith(ast);
  });
});
