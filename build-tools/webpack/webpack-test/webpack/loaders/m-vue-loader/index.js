const plugin = require('./plugin');
const { stringifyRequest } = require('../utils');
const qs = require('querystring');
const path = require('path');

let errorEmitted = false;

const loader = function (content) {
  const loaderContext = /** @type {import('webpack').LoaderContext<{}>} */ this;
  const { NS } = plugin;
  const { [NS]: pluginSignal, resourcePath, resourceQuery } = loaderContext;
  if (!errorEmitted && !pluginSignal) {
    loaderContext.emitError(
      new Error(
        'vue-loader 需要与 vue-loader-plugin 配合使用，' +
          '请在 webpack.config.js 中添加 VueLoaderPlugin 插件'
      )
    );
    errorEmitted = true;
  }

  const rawQuery = resourceQuery.slice(1);
  const inheritQuery = `&${rawQuery}`;
  const incomingQuery = qs.parse(rawQuery);

  // < 2.7 vue-template-compiler
  const compiler = require('./m-vue-template-compiler');
  const descriptor = compiler.parse({
    content,
  });

  /**
   * 有type=xxx的query，说明是请求某个block
   * 直接返回对应的block内容
   */
  if (incomingQuery.type) {
    const blockType = incomingQuery.type;
    switch (blockType) {
      case 'template':
        return descriptor.template.content;
      case 'script':
        return descriptor.script.content;
      case 'style':
        if (incomingQuery.index != null) {
          return descriptor.styles[incomingQuery.index].content;
        }
    }
    return;
  }

  let scriptImport = `var script = {};`;
  if (descriptor.script) {
    const request = stringifyRequest(
      loaderContext,
      resourcePath + `?vue&type=script&lang=js${inheritQuery}`
    );
    scriptImport = `import script from "${request}";
    export * from "${request}";
    `;
  }

  let templateImport = `var render, staticRenderFns;`;
  let templateRequest = '';
  if (descriptor.template) {
    templateRequest = stringifyRequest(
      loaderContext,
      resourcePath + `?vue&type=template${inheritQuery}`
    );
    templateImport = `import { render, staticRenderFns } from "${templateRequest}";
    `;
  }

  let stylesCode = ``;

  if (descriptor.styles.length) {
    stylesCode = descriptor.styles.reduce((acc, _, i) => {
      const request = stringifyRequest(
        loaderContext,
        resourcePath + `?vue&type=style&index=${i}&lang=css${inheritQuery}`
      );
      acc += `import style${i} from "${request}"`;
      return acc;
    }, '');
  }

  return `
${scriptImport}
${templateImport}
${stylesCode}

/* normalize component */
import normalizer from "${stringifyRequest(
    loaderContext,
    `!${require.resolve('./runtime/componentNormalizer')}`
  )}";

  var component = normalizer(
    script,
    render,
    staticRenderFns,
  );

  /* hot reload */
  if (module.hot) {
    const api = require('${require.resolve('./hot/vue-hot-reload-api')}')
    module.hot.accept();
    api.createRecord(component.options);
    module.hot.accept('${templateRequest}', function () {
      console.log('vue-loader 热更新');
      api.rerender(component.options, render, staticRenderFns);
    });
  }
  console.log('[normalizer]');

  export default component.exports;
  `;
};

loader.pitch = function (remainingRequest, precedingRequest, data) {};

module.exports = loader;

module.exports.MVueLoaderPlugin = plugin;
