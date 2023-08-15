const { declare } = require("@babel/helper-plugin-utils");
const generate = require("@babel/generator").default;

module.exports = declare((api, options) => {
  api.assertVersion(7);
  const { types } = api;

  return {
    pre(file) {
      file.set("uid", 0);
    },
    visitor: {
      CallExpression(path, state) {
        const calleeName = path.get("callee").toString();
        if (calleeName.toLocaleLowerCase() !== "vue.extend") return;

        const vueOptions = path.node.arguments[0];

        if (!types.isObjectExpression(vueOptions)) return;

        // console.log(generate(path.node).code);

        const res = {
          name: "",
        };

        vueOptions.properties.forEach((property) => {
          const key = property.key.name;
          if (key === "name") {
            res.name = property.value.value;
          } else if (key === "props") {
            const propsTypes = [];

            property.value.properties.forEach((prop) => {
              let type = "unknown";
              let optionsValue = [];
              let defaultValue = null;
              const typeValue = prop.value;
              if (types.isIdentifier(typeValue)) {
                type = typeValue.name.toLocaleLowerCase();
              } else if (types.isObjectExpression(typeValue)) {
                const typeProperty = typeValue.properties.find(
                  (p) => p.key.name === "type"
                ).value;
                if (typeProperty) {
                  if (types.isIdentifier(typeProperty)) {
                    type = typeProperty.name.toLocaleLowerCase();
                  } else if (types.isTSAsExpression(typeProperty)) {
                    type = typeProperty.expression.name.toLocaleLowerCase();
                    const typeAnnotation = typeProperty.typeAnnotation;
                    if (typeAnnotation.typeName.name === "PropType") {
                      // 目前PropType的参数都是字面量类型
                      const propTypeParam =
                        typeAnnotation.typeParameters.params[0];
                      if (types.isTSUnionType(propTypeParam)) {
                        optionsValue = propTypeParam.types.map(
                          (itemType) => itemType.literal.value
                        );
                      }
                    }
                  }
                }

                defaultValue =
                  typeValue.properties.find((p) => p.key.name === "default")
                    ?.value?.value ?? null;
              }
              // TODO: ArrayExperss

              propsTypes.push({
                name: prop.key.name,
                type: type,
                defaultValue,
                optionsValue,
              });
            });
            res.propsTypes = propsTypes;
          }
        });

        console.log(JSON.stringify(res, null, 2));
      },
    },
  };
});
