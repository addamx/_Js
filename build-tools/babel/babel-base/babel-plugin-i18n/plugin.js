// @ts-check
const { declare } = require("@babel/helper-plugin-utils");
const importModule = require("@babel/helper-module-imports");
const fse = require("fs-extra");
const { NodePath } = require("@babel/traverse");
const generate = require("@babel/generator").default;
const nodePath = require("path");

let intlIndex = 0;
function nextIntlKey() {
  ++intlIndex;
  return `intl_${intlIndex}`;
}

module.exports = declare((api, options, dirname) => {
  api.assertVersion(7);
  const { types, template } = api;
  if (!options.outputDir) {
    throw new Error("outputDir is required");
  }

  const fileMap = new Map();

  // NodePath<babel.types.StringLiteral>

  /**
   *
   * @param {NodePath<import("@babel/types").StringLiteral> | NodePath<import("@babel/types").TemplateLiteral>} path
   * @param {string} value
   * @param {string} intlUid
   * @returns {import("@babel/types").Expression}
   */
  function getReplaceExpression(path, value, intlUid) {
    const expressionParams = path.isTemplateLiteral()
      ? path.node.expressions.map((item) => generate(item).code) // 将 `${title + desc}， ${desc2}` 抽出 ['title + desc', 'desc2']
      : null;
    /**
     * `a ${b} c` => intl.t('intl1', b)
     * @type {import("@babel/types").ExpressionStatement}
     */
    // @ts-ignore
    const replaceStatement = template.ast(
      `${intlUid}.t('${value}'${
        expressionParams ? `,${expressionParams.join(",")}` : ""
      })`,
      // @ts-ignore
    );
    let replaceExpression = replaceStatement.expression;
    if (
      path.findParent((p) => p.isJSXAttribute()) && // <Jsx name="title" />
      !path.findParent((p) => p.isJSXExpressionContainer()) // <Jsx name={title} />
    ) {
      // @ts-ignore
      replaceExpression = types.jsxExpressionContainer(replaceExpression);
    }
    return replaceExpression;
  }

  function save(file, key, value) {
    const allText = fileMap.get(file);
    allText.push({
      key,
      value,
    });
  }

  return {
    pre(file) {
      fileMap.set(file, []);
    },
    visitor: {
      Program: {
        enter(path, state) {
          let imported;
          path.traverse({
            ImportDeclaration(p) {
              const source = p.node.source.value;
              if (source === "intl") {
                imported = true;
                p.stop();
              }
            },
          });
          if (!imported) {
            const uid = path.scope.generateUid("intl"); // 根据作用于生成 uid， 如果intl已经
            importModule.addDefault(path, "intl", {
              nameHint: uid,
            });
            state.intlUid = uid;
          }

          path.traverse({
            "StringLiteral|TemplateLiteral"(p) {
              // 不处理 comment里有 i18n-disable 的
              // 并把这行的comment去掉
              if (p.node.leadingComments) {
                p.node.leadingComments = p.node.leadingComments.filter(
                  (comment) => {
                    if (comment.value.includes("i18n-disable")) {
                      // @ts-ignore
                      p.node.skipTransform = true;
                      return false;
                    }
                    return true;
                  },
                );
              }

              // 不处理 import语句
              if (p.findParent((parent) => parent.isImportDeclaration())) {
                // @ts-ignore
                p.node.skipTransform = true;
              }
            },
          });
        },
      },
      StringLiteral(p, state) {
        // @ts-ignore
        if (p.node.skipTransform) return;
        let key = nextIntlKey();
        save(state.file, key, p.node.value);

        const replaceExpression = getReplaceExpression(
          p,
          key,
          // @ts-ignore
          state.intlUid,
        );
        p.replaceWith(replaceExpression);
        p.skip();
      },
      TemplateLiteral(p, state) {
        // @ts-ignore
        if (p.node.skipTransform) return;
        const value = p
          .get("quasis")
          .map((item) => item.node.value.raw)
          .join("{placeholder}");
        if (value) {
          let key = nextIntlKey();
          save(state.file, key, value);

          /** @type {string} */
          // @ts-ignore
          const intlUid = state.intlUid;
          const replaceExpression = getReplaceExpression(p, key, intlUid);
          p.replaceWith(replaceExpression);
          p.skip();
        }
      },
    },
    post(file) {
      const allText = fileMap.get(file);
      const intlData = allText.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      const content = `const resource = ${JSON.stringify(intlData, null, 2)};
  export default resource`;
      fse.ensureDirSync(options.outputDir);
      fse.writeFileSync(nodePath.join(options.outputDir, "zh-CN.js"), content);
      fse.writeFileSync(nodePath.join(options.outputDir, "en_US.js"), content);
    },
  };
});
