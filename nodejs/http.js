const http = require('http');
const fs = require('fs')
const url = require('url');
const querystring = require('querystring');
const exec = require("child_process").exec;


const hostname = '127.0.0.1';
const port = 3300;

var server1 = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write("this is text<br/>")
  res.end('<h1>Hello World</h1>');
});



// 另一种写法
/*
http.createServer(function (request, response){
  response.setHeader('Content-Type', 'text/html');
  response.write("this is text<br/>");
  response.end('<h1>Hello World</h1>');
}).listen(3300, '127.0.0.1');
console.log('Server running on port 8080.');
*/




var server2 = http.createServer(function(request,response) {
    /* fs.readFile('index.html', function readData(err,data) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        response.end(data)
    }); */
    // 或者
    fs.createReadStream(`${__dirname}/index.html`).pipe(response);
})





/* 
request:
属性:
- url：发出请求的网址。
- method：HTTP请求的方法。
- headers：HTTP请求的所有HTTP头信息。
方法:
- setEncoding()方法用于设置请求的编码
- addListener()方法用于为请求添加监听事件的回调函数。

// 遇到异步操作时，会先处理后面的请求，等到当前请求有了结果以后，再返回结果。
// 当客户端采用POST方法发送数据时，服务器端可以对 `data` 和 `end` 两个事件，设立监听函数。
*/


// 处理异步操作


 


/* 
# 处理Post请求

*/
var server4 = http.createServer(function (req, res) {
    var postData = '';

    req.on('data', function (postDataChunk) {
        postData += postDataChunk;
    });

    // exec('ls -lah', function (error, stdout, stderr) {
    //     res.write(stdout);
    // });

    req.on('end', function () {
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write("You've sent: " + postData + '[' + querystring.parse(postData).text + ']');
        res.end();
    });

});


server4.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});