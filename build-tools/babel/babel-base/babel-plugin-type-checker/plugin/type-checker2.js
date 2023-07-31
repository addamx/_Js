const { declare } = require("@babel/helper-plugin-utils");
const { resolveType, noStackTraceWrapper } = require("../common");

const noFuncAssignLint = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      CallExpression(path, state) {
        const errors = state.file.get("errors");

        const argumentsTypes = path.get("arguments").map((item) => {
          return resolveType(item.getTypeAnnotation());
        });
        const calleeName = path.get("callee").toString();
        // 获取声明的path
        const functionDeclarePath = path.scope.getBinding(calleeName).path;
        const declareParamsTypes = functionDeclarePath
          .get("params")
          .map((item) => {
            return resolveType(item.getTypeAnnotation());
          });

        argumentsTypes.forEach((item, index) => {
          if (item !== declareParamsTypes[index]) {
            noStackTraceWrapper((Error) => {
              errors.push(
                path
                  .get("arguments." + index)
                  .buildCodeFrameError(
                    `${item} can not assign to ${declareParamsTypes[index]}`,
                    Error,
                  ),
              );
            });
          }
        });
      },
    },
    post(file) {
      console.log(file.get("errors"));
    },
  };
});

module.exports = noFuncAssignLint;
