const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const IS_SERVER = !!process.env.SERVER;

const plugins = [new VueLoaderPlugin()]
if (!IS_SERVER) {
  plugins.push(new HtmlWebpackPlugin({
    template: './public/index.html',
    inject: 'body',
  }));
};

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: {
    main: IS_SERVER ? './src/entry-server.js' : './src/entry-client.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: IS_SERVER ? 'built-server-bundle.js' : 'built-client-bundle.js',
    libraryTarget: IS_SERVER ? 'commonjs2' : 'var',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  devtool: IS_SERVER ? false : 'eval-source-map',
  plugins,
  devServer: {
    port: process.env.PORT || 5101,
    open: false,
    static: {
      directory: path.join(__dirname, '../public'),
    },
    hot: true,
  },
};
