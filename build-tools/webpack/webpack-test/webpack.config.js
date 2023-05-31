const TestPlugin = require("./webpack/plugins/test-plugin");

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          // loader: './webpack/loaders/test-loader.js'
          loader: 'test-loader'
        }]
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolveLoader:{
    modules: ['node_modules', './webpack/loaders'], // 指定webpack去哪些目录下查找loader（有先后顺序）
  },
  plugins: [
    new TestPlugin()
  ]
}
