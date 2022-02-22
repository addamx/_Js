const path = require('path');

const config = {
    mode: 'development',    //4.0
    entry: path.resolve(__dirname, 'src/index.jsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [{
            test: /\.jsx$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react'],
                    //babel的plugin是顺序相关的, decorator必须在class properties之前
                    plugins: ['transform-decorators-legacy', 'transform-class-properties']
                }
            }
        }]
    },
    devtool: 'inline-source-map'
};

module.exports = config;