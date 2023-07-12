// @ts-check
const postcss = require('postcss');
const { stringifyRequest } = require('../utils');

/** @typedef { import("webpack").LoaderContext<any> } LoaderContext */

module.exports = async function loader(content) {
  // @ts-ignore
  const loaderContext = /** @type {LoaderContext} */ (this);
  const { async, resourcePath, loaders, loaderIndex } = loaderContext;
  const callback = async();
  /** @type {string[]} */
  const importUrls = [];

  const postcssRes = await postcss([
    require('./plugins/postcss-import-parser')({
      imports: importUrls,
    }),
  ]).process(content, {
    from: resourcePath, // for source-map
  });

  const importRequestPrefix = `-!${loaders
    .slice(loaderIndex, loaderIndex + 1)
    .map((loader) => stringifyRequest(loaderContext, loader.request))
    .join('!')}!`;

  const resolver = loaderContext.getResolve();

  // './module-a.css' => '/Users/xxx/project/src/module-a.css'
  const formmattedImportUrls = await Promise.all(
    importUrls.map((url) =>
      resolver(loaderContext.context, url).then((url) =>
        stringifyRequest(loaderContext, url)
      )
    )
  );

  const importModulesCode = formmattedImportUrls
    .map(
      (url, index) =>
        `import CSS_IMPORT_${index} from '${importRequestPrefix}${url}';`
    )
    .join('\n');

  const importExecCode = formmattedImportUrls
    .map(
      (_, index) => `
  mCssLoaderExport.import(CSS_IMPORT_${index});
    `
    )
    .join('\n');

  const result = `
  import mCssLoader from '${stringifyRequest(
    loaderContext,
    require.resolve('./runtime.js')
  )}';
  ${importModulesCode}

  const mCssLoaderExport = mCssLoader();
  mCssLoaderExport.push([module.id, ${JSON.stringify(postcssRes.css)}, ""]);

  ${importExecCode}

  export default mCssLoaderExport;
  `;

  callback(null, result);
};
