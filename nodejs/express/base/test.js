const express = require("express");
const app = express();
const fs = require("fs");

//app.use(express.static(__dirname + '/public'))

/**
 * 引入路由表
 */
//var routes = require('./routes')(app);

/**
 * use()
 * use是express注册中间件的方法，它返回一个函数
 */
(function () {
  app.use(function (request, response, next) {
    console.log("In comes a " + request.method + " to " + request.url);
    next();
  });
  // app.use(function (request, response) {
  //   response.writeHead(200, { "Content-Type": "text/plain" });
  //   response.end("Hello world!\n");
  // });

  //use 判断路由
  app.use(function (request, response, next) {
    if (request.url == "/home") {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("Welcome to the homepage!\n");
    } else {
      next();
    }
  });
  //简写: app.use('/path', someMiddleware); [不匹配自动调用next]
  app.use("/home1", function (request, response, next) {
    response.status(200).send("Welcome to the homepage(1)!\n");
  });
})();

/**
 * 1. 可以用别名 *, /user/:id
 * 2. 最后匹配
 */
app.get("/hello/:name", function (req, res) {
  res.end("Hello, " + req.params.name + ".");
});
app.get("*", function (request, response) {
  response.end("404!");
});

/**
 * 除了get方法以外，Express还提供post、put、delete方法，即HTTP动词都是Express的方法。
 * app.get(), app.post(), app.delete()
 */

/**
 * set()
 * 设定系统变量
 */
app.set("views", __dirname + "/views");
app.set("view engine", "jade");

/**
 * response对象
 */
(function () {
  //（1）response.redirect方法
  response.redirect("/hello/anime");
  response.redirect("http://www.example.com");
  response.redirect(301, "http://www.example.com");
  //（2）response.sendFile 发送文件
  response.sendFile("/path/to/anime.mp4");
  //（3）response.render 渲染网页模板
  app.get("/", function (request, response) {
    response.render("index", { message: "Hello World" });
  });
});

/**
 * request对象
 */
(function () {
  //request.ip属性用于获得HTTP请求的IP地址。
  request.ip;
  //request.files用于获取上传的文件。
  request.files;
});

/**
 * HTTPs服务器
 */
var https = require("https");
var httpsServer = function () {
  var options = {
    key: fs.readFileSync("E:/ssl/myserver.key"),
    cert: fs.readFileSync("E:/ssl/myserver.crt"),
    passphrase: "1234",
  };

  var server = https.createServer(options, app);
};

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("app listening at http://%s:%s", host, port);
});
