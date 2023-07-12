// @ts-check
const { stringifyRequest } = require('../utils');
const path = require('path');

const loader = function () {};

loader.pitch = function (remainingRequest) {
  // @ts-ignore
  const loaderContext = /** @type {import('webpack').LoaderContext<{}>} */ (this);
  const formattedRequest = stringifyRequest(loaderContext, remainingRequest);
  const result = `
  import content from "!!${formattedRequest}";
  import insertStyleApi from "${stringifyRequest(
    loaderContext,
    require.resolve('./runtime.js')
  )}";

  const update = () => insertStyleApi(content);
  update();

  if (module.hot) {
    module.hot.accept('!!${formattedRequest}', function(){
      console.log('【m-style-loader热更新】：${path.relative(process.cwd(), loaderContext.resourcePath)}');
      update();
    })
  }

  export default content;
`;
  return result;
};

module.exports = loader;
