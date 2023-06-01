const postcss = require('postcss');

/** @typedef { import("webpack").LoaderContext<{}> } LoaderContext */

module.exports = async function loader(content) {
  const { loaders, loaderIndex } = /** @type {LoaderContext} */ (this);
  const callback = this.async();

  // !postcss 会处理 @import
  // 但是不会处理 @import url()，并且import的文件不会加进依赖
  // const res = await postcss([
  //   require('postcss-import'),
  //   require('postcss-url'),
  //   require('postcss-preset-env')({
  //     stage: 0,
  //     browsers: 'last 2 versions',
  //   }),
  // ]).process(content, {
  //   from: this.resourcePath,
  // });

  // content = res.css;


  const importRequestPrefix = `-!${loaders
    .slice(loaderIndex, loaderIndex + 1)
    .map((loader) => loader.request)
    .join('!')}!`;
  let importModuleCode = '';
  let importApiCode = '';
  if (content.includes('@import')) {
    importModuleCode = `import cssModuleA from '${importRequestPrefix}./modulea-a.css';`;
    importApiCode = `mCssLoaderExport.import(cssModuleA)`;
  }

  const result = `
  import mCssLoader from '${require.resolve('./runtime.js')}';
  ${importModuleCode}

  const mCssLoaderExport = mCssLoader();
  mCssLoaderExport.push([module.id, "${
    importModuleCode
      ? 'body {border: 2px solid red;}'
      : 'body {  background-color: antiquewhite;}'
  }", ""]);

  ${importApiCode}

  export default mCssLoaderExport;
  `;

  callback(null, result, res.map);
};
