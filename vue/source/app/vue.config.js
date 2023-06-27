module.exports = {
  lintOnSave: false,
  pages: {
    // index: {
    //   entry: 'src/main.js',
    // },
    // 'mini-vue': 'src/main-1.js',
    // 'cus-vue': 'src/main-2.js',
    'dev-vue': 'src/main-dev.js',
  },
  configureWebpack(config) {
    config.devtool = 'source-map'
  },
  chainWebpack(config) {
    if (process.env.WEBPACK_ENV_ANALYZER) {
      config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    }
  }
};
