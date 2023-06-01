const path = require('path');

const fsPromises = require('fs').promises;

/** @typedef { import("webpack").LoaderContext<{}> } LoaderContext */

const loader = async function (source) {
  // loaderContext: https://webpack.js.org/api/loaders/#the-loader-context
  const loaderContext = /** @type {LoaderContext} */ (this);
  const options = this.getOptions();

  console.log('hander test-loeader\n');
  const logger = loaderContext.getLogger('test-loader');
  // 错误提示
  //  一般应尽量使用 logger.error，减少对用户的打扰；
  // 对于需要明确警示用户的错误，优先使用 this.emitError；
  // 对于已经严重到不能继续往下编译的错误，使用 callback
  // logger.info(loaderContext.request); // /.../webpack/loaders/test-loader.js!/.../src/plugin-a.js
  // logger.info(loaderContext.resource); // /.../src/plugin-a.js
  // loaderContext.emitError('test-loader error');

  const newSource = `
  /** Insert Comment by Test-loader */;
  ${source}`;

  const asyncCallback = this.async(); // 此时 Webpack 会将该 Loader 标记为异步加载器，
  // return newSource;

  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  const packageContent = await fsPromises.readFile('./package.json', 'utf-8');
  const appVersion = JSON.parse(packageContent).version;

  // this.emitFile('testFolder/test.txt', 'test-loader');
  this.emitFile('version.txt', appVersion);
  // addDependency 添加依赖，触发重新编译
  // 接口适用于那些 Webpack 无法理解隐式文件依赖的场景
  this.addDependency(path.resolve(__dirname, '../package.json'));

  // return newSource;
  // this.callback(null, newSource)
  asyncCallback(null, newSource);
};

// remainingRequest: loader链中在自己之后的loader的request字符串
// precedingRequest: loader链中在自己之前的loader的request字符串
// data: data对象，该对象在normal阶段可以通过this.data获取，可用于传递共享的信息

loader.pitch = (function (remainingRequest, precedingRequest, data) {
  console.log('pitch ==START==');
  console.log('🚀 ~ remainingRequest:', remainingRequest)
  console.log('🚀 ~ precedingRequest:', precedingRequest)
  console.log('🚀 ~ data:', data)
  console.log('pitch ==END==\n');
})

module.exports = loader;

// loader 函数中获取到的第一个参数 source 将会是 Buffer 对象形式的二进制内容。
// export const raw = true;
