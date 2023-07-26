// @ts-check
const { declare } = require("@babel/helper-plugin-utils");
const importModule = require("@babel/helper-module-imports");

module.exports = declare((api, options, dirname) => {
  api.assertVersion(7);
  const { types, template } = api;
  return {
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse({
            ImportDeclaration(curPath) {
              const { node } = curPath;
              if (node.source.value === options.trackerPath) {
                // 如果已经引入了 tracker
                const specifier = node.specifiers.find((specifier) => {
                  // return specifier.type === 'ImportDefaultSpecifier';
                  return types.isImportDefaultSpecifier(specifier);
                });
                if (specifier) {
                  state.trackerIdentifierName = specifier.local.name;
                }
                path.stop();
              }
            },
          });
          if (!state.trackerIdentifierName) {
            const importtedIdentifier = importModule.addDefault(
              path,
              options.trackerPath, // 导入来源 from ${options.trackerPath}
              { nameHint: "tracker" }, // nameHint 用于指定默认导入的名称，生成 `import _tracker`  如果缺失 则 import _default
            );
            state.trackerIdentifierName = importtedIdentifier.name; // _tracker
            state.trackerAST = template.statement(
              `${state.trackerIdentifierName}()`,
            )(); // 埋点代码的 AST
          }
        },
      },
      "ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration"(
        path,
        state,
      ) {
        const bodyPath = path.get("body");
        if (Array.isArray(bodyPath)) return;
        if (bodyPath.isBlockStatement()) {
          /** @type {import("@babel/types").Statement} */
          // @ts-ignore
          const ast = state.trackerAST;
          bodyPath.node.body.unshift(ast);
        } else {
           // 包裹一层block，如`const a = () => 1` 转为 `const a = () => { return 1 }
          const ast = template.statement(
            `{${state.trackerIdentifierName}(); return PREV_BODY;}`,
          )({
            PREV_BODY: bodyPath.node,
          });
          bodyPath.replaceWith(ast);
        }
      },
    },
  };
});
