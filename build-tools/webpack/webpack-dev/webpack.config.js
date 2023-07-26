
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
    // new require('mini-css-extract-plugin')(),
  ]
}
