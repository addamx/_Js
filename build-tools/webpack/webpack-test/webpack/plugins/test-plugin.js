const webpack = require('webpack');
const wpSources = webpack.sources;

const { Compiler, Compilation } = require('webpack');

class TestPlugin {
  /**
   *
   * @param {Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      'TestPlugin',
      (compilation /** @type {Compilation} */) => {
        compilation.hooks.processAssets.tap(
          'TestPlugin',
          (CompilationAssets) => {
            const cusContent = '// console.log("Hello, world!");';
            const mainSource = compilation.getAsset('main.js').source;

            /**
             * 合并source
             */
            const newMainSource = new wpSources.ConcatSource(
              mainSource,
              cusContent
            );
            // or
            // const newMainSource = new wpSources.ConcatSource(mainSource, new wpSources.RawSource(cusContent));

            // 将 source 添加到 Compilation.assets 中
            this.emitSource(compilation, 'main.js', newMainSource);

            /**
             * 往Entry插入代码
             */
            this.addToEntryJs(compilation, '// console.log("addToEntryJs")');
          }
        );
      }
    );
  }

  emitSource(compilation, name, source) {
    var exists = compilation.assets[name];
    if (compilation.updateAsset) {
      // webpack.version[0] >= '5'
      if (exists) compilation.updateAsset(name, source);
      else compilation.emitAsset(name, source);
    } else {
      if (exists) delete compilation.assets[name];
      compilation.assets[name] = source;
    }
  }

  /**
   *
   * @param {Compilation} compilation
   * @param {string} code
   */
  addToEntryJs(compilation, code) {

    const entryPoints = compilation.getStats().toJson().entrypoints;
    Object.keys(entryPoints).forEach((entryName) => {
      const entryAssets = entryPoints[entryName].assets;
      entryAssets.forEach((entryAsset) => {
        const assetName = entryAsset.name;
        const assetSource = compilation.assets[assetName].source();

        this.emitSource(compilation, assetName, new wpSources.ConcatSource(assetSource, code))
      })
    })
  }
}

module.exports = TestPlugin;
