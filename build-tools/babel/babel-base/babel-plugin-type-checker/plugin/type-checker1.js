const { declare } = require("@babel/helper-plugin-utils");
const { resolveType, noStackTraceWrapper } = require("../common");

const noFuncAssignLint = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      VariableDeclarator(path, state) {
        const errors = state.file.get("errors");

        const idType = resolveType(path.get("id").getTypeAnnotation());
        const initType = resolveType(path.get("init").getTypeAnnotation());

        if (idType !== initType) {
          noStackTraceWrapper((Error) => {
            errors.push(
              path
                .get("init")
                .buildCodeFrameError(
                  `${initType} can not assign to ${idType}`,
                  Error,
                ),
            );
          });
        }
      },
    },
    post(file) {
      console.log(file.get("errors"));
    },
  };
});

module.exports = noFuncAssignLint;
