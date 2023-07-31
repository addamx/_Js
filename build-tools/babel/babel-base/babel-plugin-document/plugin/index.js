const { declare } = require("@babel/helper-plugin-utils");
const doctrine = require("doctrine");
const fse = require("fs-extra");
const nodePath = require("path");
const renderer = require("./renderer");

function parseComment(commentStr) {
  if (!commentStr) return;

  return doctrine.parse(commentStr, {
    unwrap: true,
  });
}

function generate(docs, format = "markdown") {
  if (format === "markdown") {
    return {
      ext: "md",
      content: renderer.markdown(docs),
    };
  } else if (format === "json") {
    return {
      ext: "json",
      content: renderer.json(docs),
    };
  }
}
/**
 * @param {import("@babel/types").TSType} tsType
 * @returns {string}
 */
function resolveType(tsType) {
  if (!tsType) return;
  switch (tsType.type) {
    case "TSStringKeyword":
      return "string";
    case "TSNumberKeyword":
      return "number";
    case "TSBooleanKeyword":
      return "boolean";
    default:
      return "string";
  }
}

const documentPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    pre(file) {
      file.set("docs", []);
    },
    visitor: {
      FunctionDeclaration(path, state) {
        /** @type {any[]} */
        const docs = state.file.get("docs");
        docs.push({
          type: "function",
          name: path.get("id").toString(), // === path.node.id.name
          params: path.get("params").map((paramPath) => {
            return {
              name: paramPath.toString(),
              type: resolveType(paramPath.getTypeAnnotation()),
            };
          }),
          return: resolveType(path.get("returnType").getTypeAnnotation()),
          doc: parseComment(path.node.leadingComments?.[0]?.value),
        });
        state.file.set("docs", docs);
      },
      ClassDeclaration(path, state) {
        const docs = state.file.get("docs");
        const classInfo = {
          type: "class",
          name: path.get("id").toString(),
          constructorInfo: {},
          methodsInfo: [],
          propertiesInfo: [],
        };
        if (path.node.leadingComments) {
          classInfo.doc = parseComment(path.node.leadingComments[0].value);
        }
        path.traverse({
          ClassProperty(path) {
            classInfo.propertiesInfo.push({
              name: path.get("key").toString(),
              type: resolveType(path.get("typeAnnotation").getTypeAnnotation()),
              doc: [
                ...(path.node.leadingComments ?? []),
                ...(path.node.trailingComments ?? []),
              ]
                .filter(Boolean)
                .map((comment) => {
                  return parseComment(comment.value);
                })
                .filter(Boolean),
            });
          },
          ClassMethod(path) {
            if (path.node.kind === "constructor") {
              classInfo.constructorInfo = {
                params: path.get("params").map((paramPath) => {
                  return {
                    name: paramPath.toString(),
                    type: resolveType(paramPath.getTypeAnnotation()),
                    doc: parseComment(
                      paramPath.node.leadingComments?.[0]?.value,
                    ),
                  };
                }),
              };
            } else {
              classInfo.methodsInfo.push({
                name: path.get("key").toString(),
                doc: parseComment(path.node.leadingComments?.[0]?.value),
                params: path.get("params").map((paramPath) => {
                  return {
                    name: paramPath.toString(),
                    type: resolveType(paramPath.getTypeAnnotation()),
                  };
                }),
                retrun: resolveType(path.get("returnType").getTypeAnnotation()),
              });
            }
            docs.push(classInfo);
            state.file.set("docs", docs);
          },
        });
      },
    },
    post(file) {
      const docs = file.get("docs");
      const res = generate(docs, options.format);
      fse.ensureDirSync(options.outputDir);
      fse.writeFileSync(
        nodePath.join(options.outputDir, `docs.${res.ext}`),
        res.content,
      );
    },
  };
});

module.exports = documentPlugin;
