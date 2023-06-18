const qs = require('querystring');
const templateLoaderPath = require.resolve('./templateLoader');

/** @typedef { import("webpack").LoaderContext<{}> } LoaderContext */

module.exports = (code) => code;

module.exports.pitch = function () {
  const loaderContext = /** @type {LoaderContext} */ (this);
  const { loaders: originLoader, resourceQuery } = loaderContext;
  const query = qs.parse(resourceQuery.slice(1));

  const loaders = originLoader.filter((l) => l.path !== __filename);

  if (query.type === 'template') {
    const preLoaders = loaders.filter((l) => !l.pitchExecuted);
    const postLoaders = loaders.filter((l) => l.pitchExecuted);
    const request = genRequest(
      [
        ...postLoaders,
        {
          request: templateLoaderPath,
        },
        ...preLoaders,
      ],
      loaderContext
    );
    return `export * from "${request}";`;
  }

  if (query.type === 'style') {
    /**
     * 在cssloader之前插入stylePostLoader-用于scoped css
     * "-!../webpack/loaders/m-style-loader/index.js!../webpack/loaders/m-css-loader/index.js!../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../node_modules/vue-loader/lib/index.js??vue-loader-options!./App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css&" */
    // const cssLoaderIndex = loaders.findIndex((l) => /\bcss-loader/.test(l.path))
    // if (~cssLoaderIndex) {
    //   const afterLoaders = loaders.slice(0, cssLoaderIndex + 1);
    //   const beforeLoaders = loaders.slice(cssLoaderIndex + 1);
    //   const request = genRequest(
    //     [
    //       ...afterLoaders,
    //       require.resolve('./stylePostLoader'),
    //       ...beforeLoaders,
    //     ],
    //     loaderContext
    //   );
    //   return `export * from "${request}";`;
    // }
    return `export * from "${genRequest(loaders, loaderContext)}";`;
  }

  const request = genRequest(loaders, loaderContext);
  // import mod from "-!../webpack/loaders/cus-loader.js!../webpack/loaders/test-loader.js!../node_modules/vue-loader/lib/index.js??vue-loader-options!./App.vue?vue&type=script&lang=js&";
  // export default mod; export * from "-!../webpack/loaders/cus-loader.js!../webpack/loaders/test-loader.js!../node_modules/vue-loader/lib/index.js??vue-loader-options!./App.vue?vue&type=script&lang=js&"
  return `import mod from "${request}"; export default mod; export * from "${request}";`;
};

/**
 *
 * @param {LoaderContext['loaders']} loaders
 * @param {LoaderContext} loaderContext
 * @returns
 */
function genRequest(loaders, loaderContext) {
  const { resourcePath, resourceQuery } = loaderContext;
  const request = loaders.map((l) => l.request).join('!');
  return `-!${request}!${resourcePath}${resourceQuery}`;
}
