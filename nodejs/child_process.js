
var child_process = require('child_process');
var path = require('path');

/**
 * `exec()`执行bash命令
 * 有用户输入的情况下，最好不使用`exec`方法，而是使用`execFile`方法
 */
(function(){
  var exec = require('child_process').exec;
  var ls = exec('node -v', function (error, stdout, stderr) {
    if (error) {
      console.log(error.stack);
      console.log('Error code: ' + error.code);
    }
    console.log('Child Process STDOUT: ' + stdout);
  });
  //另一种写法: 使用监听事件
  //适合情景: 如果子进程运行时间较长，或者是持续运行。
  var child = exec('node -v');
  child.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });
  child.stderr.on('data', function (data) {
    console.log('stdout: ' + data);
  });
  child.on('close', function (code) {
    console.log('closing code: ' + code);
  });
})();




/**
 * execSync()
 * 第一个参数是所要执行的命令，第二个参数用来配置执行环境。
 */
(function(){
  var execSync = require("child_process").execSync;

  var SEPARATOR = process.platform === 'win32' ? ';' : ':';
  var env = Object.assign({}, process.env);
  //将本地的node_modules/.bin添加至系统环境变量
  env.PATH = path.resolve('./node_modules/.bin') + SEPARATOR + env.PATH;

  function myExecSync(cmd) {
    var output = execSync(cmd, {
      cwd: process.cwd(),
      env: env
    });

    console.log(output);
  }

  //myExecSync('eslint .');
})();




/**
 * execFile()
 * execFile方法直接执行特定的程序，参数作为数组传入，不会被bash解释，因此具有较高的安全性。
 * 假定path来自用户输入，如果其中包含了分号或反引号，ls程序不理解它们的含义，因此也就得不到运行结果，安全性就得到了提高。
 */
(function(){

  var path = ".";
  child_process.execFile('/bin/ls', ['-l', path], function (err, result) {
    console.log(result)
  });
})//();

/**
 * spawn() :**用于监听**
 * 创建一个子进程来执行特定命令，用法与execFile方法类似，但是没有回调函数
 * 属于异步执行，适用于子进程长时间运行的情况
 */
(function(){
    var path = '.';
    var ls = child_process.spawn('/bin/ls', ['-l', path]);
    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    ls.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });
});//();

//spawn方法与exec方法非常类似，只是使用格式略有区别。
/*
child_process.exec(command, [options], callback)
child_process.spawn(command, [args], [options])
*/



/**
 * fork(): 使用node执行js文件, 并并建立通信通道
 * fork('./child.js') 相当于 spawn('node', ['./child.js'])
 * fork会在父进程与子进程之间，建立一个通信管道，用于进程之间的通信。
 *
 * 通信方法:
 * send()
 */
(function(){
  var n = child_process.fork('./_temp/child.js');
  n.on('message', function (m) {
    console.log('PARENT got message:', m);
  });
  n.send({ hello: 'world' });
})();
