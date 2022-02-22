const styleVariables = require('./src/component/Button/variables');

module.exports = function override(config, env) {
  const newConfig = config;

  newConfig.module.rules.push({
    test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader?sourceMap&minimize',
        {
          loader: 'sass-loader',
          options: {
            data: Object.keys(styleVariables)
              .map(key => `\$${key}: ${styleVariables[key]};`)
              .join('\n'),
            sourceMap: true,
            sourceMapContents: true
          }
        }
      ]
  })
  // throw new Error;
  return newConfig;
}
