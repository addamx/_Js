const path = require('path')

module.exports = (baseConfig, env, defaultConfig) => {

  defaultConfig.module.rules.path({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('awesome-typescript-loader')
  });
  defaultConfig.resolve.extension.push('.ts', '.tsx');
  return defaultConfig;

};
