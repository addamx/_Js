# command

- `webpack --json` 输出打包信息

```cmd
yarn analyze
npx webpack-bundle-analyzer stats.json
```

# webpack

- webpack(options, callback)
- 生成标准化的options（但没给默认值）: getNormalizedWebpackOptions(rawOptions)
  - file://./node_modules/webpack/lib/webpack.js#62
- new Compiler
  - compiler hooks
    - file://./node_modules/webpack/lib/Compiler.js#125
  - resolverFactory, hooks
    - file://./node_modules/webpack/lib/ResolverFactory.js#73
  - requestShortener
    - 用于:
  - cache, hooks
    - file://./node_modules/webpack/lib/Cache.js#49
- NodeEnvironmentPlugin({infrastructureLogging: ...}).apply(compiler)
  - 定义logger参数
  - 定义文件系统（默认fs）
- 初始化插件

```javascript
if (typeof plugin === "function") {
  plugin.call(compiler, compiler);
} else {
  plugin.apply(compiler);
}
```

- 给options设置默认值: applyWebpackOptionsDefaults(options)

  - 根据 mode 设置options默认值
  - file://./node_modules/webpack/lib/config/defaults.js#137
- 执行 HOOK compiler.hooks.environment
- 执行 HOOK compiler.hooks.afterEnvironment
- WebpackOptionsApply().process

  - file://./node_modules/webpack/lib/WebpackOptionsApply.js#71
  - 根据新的options，定义compiler的设置，以及辅助插件
    - options.externals

      - ExternalsPlugin
    - ChunkPrefetchPreloadPlugin
    - options.output.chunkFormat

      - "array-push"： ArrayPushCallbackChunkFormatPlugin
      - "commonjs": CommonJsChunkFormatPlugin
      - "module": ModuleChunkFormatPlugin
    - options.output.enabledChunkLoadingTypes

      - EnableChunkLoadingPlugin
    - options.output.enabledLibraryTypes

      - EnableLibraryPlugin
    - output.pathinfo

      - ModuleInfoHeaderPlugin
    - options.output.clean

      - CleanPlugin
    - options.devtool

      - EvalSourceMapDevToolPlugin
      - SourceMapDevToolPlugin
      - EvalDevToolModulePlugin
    - JavascriptModulesPlugin
    - JsonModulesPlugin
    - AssetModulesPlugin
    - options.experiments.css

      - CssModulesPlugin
    - EntryOptionPlugin
    - HOOK compiler.hooks.entryOption
    - RuntimePlugin
    - InferAsyncModulesPlugin
    - DataUriPlugin
    - FileUriPlugin
    - CompatibilityPlugin
    - HarmonyModulesPlugin
    - options.amd

      - AMDPlugin
      - RequireJsStuffPlugin
    - CommonJsPlugin
    - LoaderPlugin
    - APIPlugin
    - ConstPlugin
    - UseStrictPlugin
    - options.optimization.splitChunks

      - SplitChunksPlugin
    - options.optimization.minimize

      - options.optimization.minimizer: TerserPlugin
    - options.performance

      - SizeLimitsPlugin
    - TemplatedPathPlugin
    - options.cache

      - MemoryCachePlugin
    - ResolverCachePlugin
    - HOOK compiler.hooks.afterPlugins
    - HOOK compiler.hooks.afterResolvers
- HOOK compiler.hooks.initialize
- compiler.run()

  - HOOK compiler.hooks.beforeRun
  - HOOK compiler.hooks.run
- compiler.compile()

  - newCompilationParams

    - createNormalModuleFactory

      - new NormalModuleFactory
        - hooks
      - HOOK compiler.hooks.normalModuleFactory
    - createContextModuleFactory

      - new ContextModuleFactory
        - hooks
      - HOOK compiler.hooks.contextModuleFactory.
  - HOOK compiler.hooks.beforeCompile
  - HOOK compiler.hooks.compile
  - compilation = newCompilation

    - new Compilation
      - file://./node_modules/webpack/lib/Compilation.js#433
      - hooks
      - new ModuleGraph()
    - HOOK compiler.hooks.hooks.thisCompilation
    - HOOK compiler.hooks.hooks.compilation
  - HOOK compiler.hooks.make
  - HOOK compiler.hooks.finishMake
  - compilation.finish()

    - new ModuleGraph
  - compilation.seal()

    - new ChunkGraph()
    - ChunkGraph.setChunkGraphForModule
    - CPA-HOOKS compilation.hooks.seal
    - CPA-HOOKS compilation.hooks.optimizeDependencies
    - CPA-HOOKS compilation.hooks.afterOptimizeDependencies
    - CPA-HOOKS compilation.hooks.beforeChunks
    - loop this.entries
      - chunk addChunk
        - new Chunk
          - file://./node_modules/webpack/lib/Chunk.js#68
      - new Entrypoint().setEntrypointChunk(chunk)
        - file://.node_modules/webpack/lib/Entrypoint.js
    - buildChunkGraph
    - CPA-HOOKS compilation.hooks.afterChunks
    - CPA-HOOKS compilation.hooks.optimize
    - CPA-HOOKS compilation.hooks.optimizeModules
    - CPA-HOOKS compilation.hooks.afterOptimizeModules
    - CPA-HOOKS compilation.hooks.optimizeChunks
    - CPA-HOOKS compilation.hooks.afterOptimizeChunks
    - CPA-HOOKS compilation.hooks.optimizeTree
    - CPA-HOOKS compilation.hooks.afterOptimizeTree
    - CPA-HOOKS compilation.hooks.optimizeChunkModules
    - CPA-HOOKS compilation.hooks.shouldRecord
    - CPA-HOOKS compilation.hooks.reviveModules
    - CPA-HOOKS compilation.hooks.beforeModuleIds
    - CPA-HOOKS compilation.hooks.moduleIds
    - CPA-HOOKS compilation.hooks.optimizeModuleIds
    - CPA-HOOKS compilation.hooks.afterOptimizeModuleIds
    - CPA-HOOKS compilation.hooks.reviveChunks
    - CPA-HOOKS compilation.hooks.beforeChunkIds
    - CPA-HOOKS compilation.hooks.chunkIds
    - CPA-HOOKS compilation.hooks.optimizeChunkIds
    - CPA-HOOKS compilation.hooks.afterOptimizeChunkIds
    - CPA-HOOKS compilation.hooks.optimizeCodeGeneration
    - CPA-HOOKS compilation.hooks.beforeModuleHash
    - createModuleHashes
    - CPA-HOOKS compilation.hooks.afterModuleHash
    - CPA-HOOKS compilation.hooks.beforeCodeGeneration
    - codeGeneration
      - new CodeGenerationResults
      - _runCodeGenerationJobs
      - _codeGenerationModule
        - module.codeGeneration
    - CPA-HOOKS compilation.hooks.afterCodeGeneration
    - _runCodeGenerationJobs
    - CPA-HOOKS compilation.hooks.beforeModuleAssets
    - createModuleAssets
    - CPA-HOOKS compilation.hooks.processAssets
    - CPA-HOOKS compilation.hooks.afterProcessAssets
    - summarizeDependencies
    - CPA-HOOKS compilation.hooks.needAdditionalSeal
    - CPA-HOOKS compilation.hooks.afterSeal
    - CPA-HOOKS compilation.hooks.shouldGenerateChunkAssets
    - CPA-HOOKS compilation.hooks.beforeChunkAssets
    - #写入
    - createChunkAssets
      - getRenderManifest
      - emitAsset
      - CPA-HOOKS compilation.hooks.chunkAsset
  - HOOK compiler.hooks.afterCompile

# Hook
