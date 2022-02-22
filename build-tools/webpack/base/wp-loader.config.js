var path = require("path");
var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: './src/script/app.js'
	},
	output: {
		path: path.resolve('./dist/'),
		filename: 'js/[name].js',
		//publicPath: 'http//cdn.com/'
	},
	context: __dirname,	//entry选项的基础目录(绝对路径), 默認已經是__dirname
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: path.resolve('./node_modules/'),
				include: path.resolve('./src/'),
				options: {
					presets: ['env']
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1		//告示@import来的css文件使用之前多少个loader;只对.css文件起效
						}
					},
					/*
					 1. 除了如以下写, 或者通过`postcss.config.js`文件添加config内容;
					 2. !!当style-loader使用了importLoaders时, 必须有`postcss.config.js`文件
					 */
					{
						loader: 'postcss-loader',
						options: {
							plugins: (loader) => [
								require('autoprefixer')({
									broswers: ['last 5 versions']
								}),
							]
						}
					},
				]
			},
			{	//不同于css文件, 即使less/sass有@import, 也不需要css-loader的importLoaders值
				test: /\.less$/,
				loader: 'style-loader!css-loader!postcss-loader!less-loader'
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!postcss-loader!sass-loader'
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.ejs$/,
				loader: 'ejs-loader'
			},
			{
				test: /\.(png|jpg|gif|svg)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 5000,
							name: 'assets/[name]-[hash:5].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new htmlWebpackPlugin({
			filename: 'app.html',
			template: 'app.html',
			inject: 'body'
		})
	]
}
