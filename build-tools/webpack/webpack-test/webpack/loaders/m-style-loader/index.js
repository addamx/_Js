const loader = function () {};

loader.pitch = function (remainingRequest) {
  return `
  import content from "!!${remainingRequest}";
  import insertStyleApi from "${require.resolve('./runtime.js')}";

  insertStyleApi(content);

  export default content;
  `;
};

module.exports = loader;
