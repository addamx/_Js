const { declare } = require("@babel/helper-plugin-utils");
const { resolveType, noStackTraceWrapper } = require("../common");

module.exports = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      CallExpression(path, state) {
        const errors = state.file.get("errors");
        // add<number>(1, '2')的 typeParameters 是<number>,typeParameters.params是[NumberTypeAnnotation]
        // realTypes是['number']
        const realTypes = path.node.typeParameters.params.map((item) => {
          return resolveType(item);
        });
        // add<number>(1, '2'): ['number', 'string']
        const argumentsTypes = path.get("arguments").map((item) => {
          return resolveType(item.getTypeAnnotation());
        });
        const calleeName = path.get("callee").toString();
        const functionDeclarePath = path.scope.getBinding(calleeName).path;

        // 泛型的真实类型
        // { T: 'number' }
        const realTypeMap = {};
        functionDeclarePath.node.typeParameters.params.map((item, index) => {
          realTypeMap[item.name] = realTypes[index];
        });
        const declareParamsTypes = functionDeclarePath
          .get("params")
          .map((item) => {
            return resolveType(item.getTypeAnnotation(), realTypeMap);
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
