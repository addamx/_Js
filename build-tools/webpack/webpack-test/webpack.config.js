const TestPlugin = require('./webpack/plugins/test-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const { MVueLoaderPlugin } = require('./webpack/loaders/m-vue-loader');

const isCus = !!process.env.CUS;
console.log('🚀 ~ isCus:', isCus);

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: {
    main: './src/index.js',
    // hot: 'webpack/hot/dev-server.js',
    // client: 'webpack-dev-server/client/index.js?hot=true&live-reload=true',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // {
          // loader: './webpack/loaders/test-loader.js'
          // },
          // 'cus-loader',
          // 'test-loader',
        ],
      },
      {
        test: /\.css$/,
        use: isCus
          ? ['m-style-loader', 'm-css-loader']
          : ['style-loader', 'css-loader'],
      },

      isCus
        ? {
            test: /\.vue$/,
            loader: 'm-vue-loader',
          }
        : {
            test: /\.vue$/,
            loader: 'vue-loader',
          },
    ],
  },
  devtool: 'source-map',
  resolveLoader: {
    modules: ['node_modules', './webpack/loaders'], // 指定webpack去哪些目录下查找loader（有先后顺序）
  },
  plugins: [
    new TestPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body',
    }),
    isCus ? new MVueLoaderPlugin() : new VueLoaderPlugin(),
  ],
  // npm webpack-dev-server
  devServer: {
    port: process.env.PORT || 4234,
    open: false,
    static: {
      directory: path.join(__dirname, '../public'),
    },
    hot: true,
  },
  // cache: false,
};
