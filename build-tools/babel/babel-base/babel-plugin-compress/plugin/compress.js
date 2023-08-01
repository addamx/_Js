const { declare } = require("@babel/helper-plugin-utils");

// return 之后，如果是 函数声明 或者 var 声明，就不要移除
function isRequiredAfterCompletion(path) {
  return (
    path.isFunctionDeclaration() ||
    path.isVariableDeclaration({
      kind: "var",
    })
  );
}

module.exports = declare((api, options) => {
  api.assertVersion(7);

  return {
    pre(file) {
      file.set("uid", 0);
    },
    visitor: {
      BlockStatement(path) {
        const statementPaths = path.get("body");
        let completed = false;

        for (const statementPath of statementPaths) {
          if (statementPath.isCompletionStatement()) {
            // break/continue/return/throw
            completed = true;
            continue;
          }

          if (completed && !isRequiredAfterCompletion(statementPath)) {
            statementPath.remove();
          }
        }
      },
      Scopable(path, state) {
        // path.scope.bindings: 作用域内的所有变量
        Object.entries(path.scope.bindings).forEach(([key, binding]) => {
          if (binding.referenced) return; // 有引用的变量不移除

          // binding.path.get("init"): 变量的初始化部分
          // const a = b() 中 b() 就是init
          if (binding.path.get("init").isCallExpression()) {
            // 函数前有PURE注释的，可以移除
            const comments = binding.path.get("init").node.leadingComments;
            if (comments?.[0]?.value?.includes("PURE")) {
              binding.path.remove();
              return;
            }
          }

          if (!path.scope.isPure(binding.path.node.init)) {
            // 如果不是纯函数，则把申明的变量替换为右边部分:  `const a = b()` -> `b()`
            binding.path.parentPath.replaceWith(
              api.types.expressionStatement(binding.path.node.init),
            );
          } else {
            // 如果是纯函数，可以移除
            binding.path.remove();
          }
        });
      },
    },
  };
});
