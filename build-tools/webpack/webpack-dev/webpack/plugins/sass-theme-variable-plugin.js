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
      'ScssThemeVariablePlugin',
      (compilation /** @type {Compilation} */) => {
        compilation.hooks.processAssets.tap(
          'ScssThemeVariablePlugin',
          (CompilationAssets) => {

          }
        );
      }
    );
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
