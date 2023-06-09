const webpack = require('webpack');
const { Compiler, Compilation } = require('webpack');
const qs = require('querystring');

const PLUGIN_ID = 'MVueLoaderPlugin';
const NS = 'vue-loader';

class MVueLoaderPlugin {
  /**
   *
   * @param {Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      PLUGIN_ID,
      (compilation /** @type {Compilation} */) => {
        // webpack4
        // compilation.hooks.normalModuleLoader.tap(PLUGIN_ID, (loaderContext) => {
        //   loaderContext[NS] = true;
        // });

        // webpack5
        // 给loaderContext添加标识，以便loader执行时可以检测是否有对应的plugin
        const normalModule = compiler.webpack.NormalModule;
        normalModule.getCompilationHooks(compilation).loader.tap(
          PLUGIN_ID,
          (loaderContext) => {
            loaderContext[NS] = true;
          }
        );
      }
    );

    const rules = compiler.options.module.rules;
    let rawVueRule;
    const clonedRules = [];

    for (const rawRule of rules) {
      if (rawRule.test && rawRule.test.toString().includes('.vue')) {
        // vueRules.push(rawRule);
        rawVueRule = rawRule;
      } else {
        let currentResource;
        const { test: testCondition, ...restRuleOps } = rawRule;
        const clonedRule = {
          ...restRuleOps,
          resource(resources) {
            currentResource = resources;
            return true;
          },
          resourceQuery(query) {
            if (!query) return false;
            const parsedQueryObj = qs.parse(query.slice(1));
            if (parsed.vue == null) {
              return false;
            }
            // .../app.vue => ../app.vue.js
            // .../app.vue => ../app.vue.css
            const fakeResourcePath = `${currentResource}.${parsedQueryObj.lang}`;
            return testCondition.test(fakeResourcePath);
          },
        };
        clonedRules.push(clonedRule);
      }
    }

    if (!rawVueRule) {
      logger.error('未找到vue-loader的rules');
    }
    compiler.options.module.rules = [
      // pitcher
      {
        loader: require.resolve('./pitcher'),
        resourceQuery(query) {
          if (!query) {
            return false;
          }
          const parsedQueryObj = qs.parse(query.slice(1));
          return parsedQueryObj.vue != null;
        },
      },
      ...clonedRules,
      ...rules,
    ];
  }
}

MVueLoaderPlugin.NS = NS;
module.exports = MVueLoaderPlugin;
