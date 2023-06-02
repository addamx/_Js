const TestPlugin = require('./webpack/plugins/test-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // {
          // loader: './webpack/loaders/test-loader.js'
          // },
          'cus-loader',
          'test-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          'm-style-loader',
          // 'css-loader'
          'm-css-loader',
        ],
      },
    ],
  },
  devtool: false,
  resolveLoader: {
    modules: ['node_modules', './webpack/loaders'], // 指定webpack去哪些目录下查找loader（有先后顺序）
  },
  plugins: [
    new TestPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body',
    }),
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
};
