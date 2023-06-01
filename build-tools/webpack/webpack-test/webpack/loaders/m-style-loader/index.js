const loaderUtils = require('loader-utils');

const loader = function () {};

loader.pitch = function (remainingRequest) {
  return `
  import content from "!!${remainingRequest.replaceAll('\\', '/')}";
  import insertStyleApi from "${require.resolve('./runtime.js').replaceAll('\\', '/')}";

  insertStyleApi(content);

  export default content;
  `;
};

module.exports = loader;
