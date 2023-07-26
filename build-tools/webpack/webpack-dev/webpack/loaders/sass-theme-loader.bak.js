const { parse: parseScss, stringify } = require('postcss-scss');
const colorUtils = require('./color-utils');

const colors = [];
exports.colors = colors;

/** @typedef { import("webpack").LoaderContext<{}> } LoaderContext */

const loader = async function (source) {

  // loaderContext: https://webpack.js.org/api/loaders/#the-loader-context
  const loaderContext = /** @type {LoaderContext} */ (this);
  const options = loaderContext.getOptions();

  const logger = loaderContext.getLogger('test-loader');
  const asyncCallback = loaderContext.async(); // 此时 Webpack 会将该 Loader 标记为异步加载器

  const scssParser = parseScss(source);
  let mainColor = '';
  scssParser.walk((node) => {
    if (node.type === 'decl') {
      if (node.prop === '$--primary-color') {
        mainColor = node.value;
        colors.push(mainColor)
      } else if (node.value.includes('$--primary-color')) {
        const convertedColor = colorFunction(node.value.replace('$--primary-color', mainColor));
        if (convertedColor !== node.value) {
          colors.push(convertedColor);
        }
      }
    }
  })
  console.log('🚀 ~ scssParser.walkDecls ~ colors:', colors)
  // scssParser.walk((node) => {
  //   console.log(node)
  // });

  // const result = await sass.compileString('style.scss');

  asyncCallback(null, source);
};

/**
 * lighten($--primary-color, 20%)
 * @param {string} source
 * @returns
 */
function colorFunction(source) {
  const matchRes = source.match(/(lighten|darken)\((.+?),\s?(\d+)%\)/)
  if (!matchRes) return source;
  const [_, op, hexColor, percentage] = matchRes;

  let res = hexColor;

  switch(op) {
    case 'lighten':
      res = colorUtils.lighten(hexColor, +percentage / 100);
      break;
    case 'darken':
      res = colorUtils.darken(hexColor, +percentage / 100);
      break;
  }

  return res
}


module.exports = loader;

// loader 函数中获取到的第一个参数 source 将会是 Buffer 对象形式的二进制内容。
// export const raw = true;
