const { declare } = require("@babel/helper-plugin-utils");

module.exports = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      ForStatement(path, state) {
        const errors = state.file.get("errors");
        const testOperator = path.node.test.operator;
        const updateOperator = path.node.update.operator;

        let shouldUpdateOperator;
        if (["<", "<="].includes(testOperator)) {
          shouldUpdateOperator = "++";
        } else if ([">", ">="].includes(testOperator)) {
          shouldUpdateOperator = "--";
        }

        if (updateOperator !== shouldUpdateOperator) {
          const tmp = Error.stackTraceLimit;
          Error.stackTraceLimit = 0; // 不打印堆栈信息，只打印1行
          errors.push(
            path
              .get("update")
              .buildCodeFrameError(
                `The update operator should be '${shouldUpdateOperator}'`,
                Error
              ),
          );
          Error.stackTraceLimit = tmp;
        }
      },
    },
    post(file) {
      console.log(file.get("errors"));
    },
  };
});
