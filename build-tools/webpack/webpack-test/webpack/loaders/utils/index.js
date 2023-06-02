// @ts-check

/** @typedef {import('webpack').LoaderContext<{}>} LoaderContext */

/**
 * request或路劲转为相对路径
 * @param {LoaderContext} loaderContext
 * @param {string} request
 */
exports.stringifyRequest = (loaderContext, request) => {
  return loaderContext.utils.contextify(loaderContext.context, request);
}
