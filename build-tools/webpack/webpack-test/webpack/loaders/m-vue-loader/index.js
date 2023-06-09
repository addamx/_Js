const plugin = require('./plugin');

let errorEmitted = false

const loader = function (content) {
  const loaderContext = /** @type {import('webpack').LoaderContext<{}>} */ this;
  const { NS } = plugin;
  const { [NS]: pluginSignal } = loaderContext;
  if (!errorEmitted && !pluginSignal) {
    loaderContext.emitError(
      new Error(
        'vue-loader 需要与 vue-loader-plugin 配合使用，' +
          '请在 webpack.config.js 中添加 VueLoaderPlugin 插件'
      )
    );
    errorEmitted = true
  }

  return `
  import { render, staticRenderFns } from "./App.vue?vue&type=template&id=7ba5bd90&"
  import script from "./App.vue?vue&type=script&lang=js&"
  export * from "./App.vue?vue&type=script&lang=js&"
  import style0 from "./App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css&"


  /* normalize component */
  import normalizer from "!../node_modules/vue-loader/lib/runtime/componentNormalizer.js"
  var component = normalizer(
    script,
    render,
    staticRenderFns,
    false,
    null,
    null,
    null
  )

  export default component.exports
`
};

loader.pitch = function (remainingRequest, precedingRequest, data) {};

module.exports = loader;

module.exports.MVueLoaderPlugin = plugin;
