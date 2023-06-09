const qs = require('querystring');

/** @typedef { import("webpack").LoaderContext<{}> } LoaderContext */

module.exports = (code) => code;

module.exports.pitch = () => {
  const loaderContext = /** @type {LoaderContext} */ (this);
  const { resourceQuery, loaders: originLoader } = loaderContext;

  const parsedQueryObj = qs.parse(resourceQuery.slice(1));

  const loaders = originLoader.filter((l) => l.path !== __filename);

  const request = genRequest(loaders);

  return `import mod from ${request}; export default mod; export * from ${request};`
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
