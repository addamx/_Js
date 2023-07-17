
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: {
    main: './src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'sass-theme-loader'
        ]
      }
    ],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      'webpack/loaders',
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // new require('./plugins/scss-theme-variable-plugin.js')
  ]
}
