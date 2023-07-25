// @ts-check
const {declare} = require('@babel/helper-plugin-utils');
const importModule = require('@babel/helper-module-imports');

exports.babelPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse({
            ImportDeclaration(curPath) {
              const { node } = curPath;
              if (node.source.value === options.trackerPath) {
                const specifier = node.specifiers.find(specifier => {
                  // return specifier.type === 'ImportDefaultSpecifier';
                  return types.isImportDefaultSpecifier(specifier);
                });
                if (specifier) {
                  state.trackerIdentifier = specifier.local.name;
                }
              }
            }
          })
        }
      }
    }
  }
})
