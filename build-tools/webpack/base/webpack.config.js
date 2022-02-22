var path = require("path");
var htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  //多个entry 针对多页面
  entry: {
    main: "./src/script/main.js",
    a: "./src/script/a.js",
    b: "./src/script/b.js",
    c: "./src/script/c.js",
    app: "./src/script/app.js"
  },
  // context: path.resolve(__dirname, 'app'),	//entry 和 loader的基础目录, 默认当前目录
  output: {
    path: path.resolve("./dist/js/"), //生成文件所在
    filename: "[name].js",
    publicPath: "http//cdn.com/" //替换所有模板中引用的资源路径
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: "index.html", //'index-[hash].html'
      template: "index.html", //模板
      inject: "body", //'head' 'body'插入的位置, false 不插入
      title: "webpack is good", //自定义打变量
      minify: {
        removeComments: true //删除注释
        // collapseWhitespace: false,	//删除所有空格
      }
    }),
    /*`chunks`属性指定各模板需要的chunks*/
    new htmlWebpackPlugin({
      filename: "a.html",
      template: "chunks.html",
      inject: "head",
      title: "This is a",
      //chunks: ['main', 'a'],		//指定哪些chunks
      excludeChunks: ["b", "c"] //排除哪些chunks, 其他chunks都要
    }),
    new htmlWebpackPlugin({
      filename: "b.html",
      template: "chunks.html",
      inject: "head",
      title: "This is b",
      chunks: ["b"]
    }),
    new htmlWebpackPlugin({
      filename: "c.html",
      template: "chunks.html",
      inject: "head",
      title: "This is c",
      chunks: ["c"]
    }),
    /*
    webpack3: Scope Hoisting(https://zhuanlan.zhihu.com/p/27980441)
    优点:
    1. 文件体积比之前更小。
    2. 运行代码时创建的函数作用域也比之前少了，开销也随之变小。
    执行失败原因:
    0. 被提升的module 必须是es2015格式
    1. 使用了 ProvidePlugin
    2. 使用了 eval() 函数
    3. 你的项目有多个 entry
    4. 需要使用 local的webpack-cli
    检查原因: `webpack --display-optimization-bailout`
    */
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};
