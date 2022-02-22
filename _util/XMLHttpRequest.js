//XMLHttpRequest Level 2 使用指南 http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html
//你真的会使用XMLHttpRequest吗？ https://segmentfault.com/a/1190000004322487#articleHeader0

/*
当xhr为同步请求时，有如下限制：
xhr.timeout必须为0
xhr.withCredentials必须为 false
xhr.responseType必须为""（注意置为"text"也不允许）
*/

/**
 * XMLHttpRequeest (1)
 * level 1的缺点:
 * 1. 只支持文本数据, 无法读取和上传二进制文件;
 * 2. 传送和接收数据时, 没有进度信息, 只能提示有没有完成;
 * 3. "同域限制"
 */
var request = function(method, url, callback, postVars) {
  var xhr = new XMLHttpRequest();
  xhr.onreadstatechange = function () {
    if (xhr.readyState !== 4) return; //等于4表示数据已经接收完毕
    (xhr.status == 200) ?
      callback.success(xhr.responseText) :
      callback.failure(xhr.responseText);
  }
  xhr.open(method, url, true);
  if (method !== 'POST') postVars = null;
  xhr.send(postVars);
}


/**
 * XMLHttpRequest (2)
 * 1. 可以设置HTTP请求时限
 * 2. FormData管理表单数据
 * 3. 可以上传文件; 可以获取服务器端的二进制数据;
 * 4. 请求不同域名的数据(跨域)
 * 5. 可以获取数据传输的进度信息
 */
var request = function(method, url, callback, postVars) {
  var xhr = new XMLHttpRequest();

  //相当于readState === 4
  xhr.onload = function () {
    (xhr.status == 200) ?
      callback.success(xhr.responseText) :
      callback.failure(xhr.responseText);
  }
  xhr.timeout = 3000; //当xhr为一个sync同步请求时，xhr.timeout必须置为0，否则会抛错
  xhr.ontimeout = function (e) {};
  xhr.onerror = function (e) {};

  xhr.onloadstart = function(ev){} //send()方法执行瞬间
  xhr.loadend = function(ev){}

  xhr.open(method, url, true);
  if (method !== 'POST') postVars = null;
  xhr.send(postVars);

}

//请求时限
xhr.timeout = 3000;


//formData
var formData = new FormData(document.getElementById('myform'));
formData.append('name', 'tom');

//上传文件
for (var i = 0; i < files.length;i++) {
　　formData.append('files[]', files[i]);
}

//接收文件
//A.改写MIMEType,  将二进制数据伪装成文本数据;
xhr.overrideMimeType('text/plain; charset=x-user-defined');
var binStr = xhr.responseText;
//一个个字节还原成二进制
for (var i = 0, len = binStr.length; i < len; ++i) {
  var c = binStr.charCodeAt(i);
  var byte = c & 0xff;  //表示在每个字符的两个字节之中，只保留后一个字节，将前一个字节扔掉。原因是浏览器解读字符的时候，会把字符自动解读成Unicode的0xF700-0xF7ff区段。
}
//B.responseType属性
//B.1
xhr.reponseType = 'blob';
//读取xhr.response，而不是xhr.responseText。
var blob = new Blob([xhr.reponse], {type: 'image/png'});
//B.2
xhr.responseType = "arraybuffer";
var arrayBuffer = xhr.response;
if (arrayBuffer) {
  var byteArray = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteArray.byteLength; i++) {
    //do something
  }
}

//进度信息
//event.total是需要传输的总字节， 如果event.lengthComputable不为真，则event.total等于0。
//event.loaded是已经传输的字节
//
//上传
xhr.onprogress = function(event) {
  if(event.lengthComputable) {
    var percentComplete = event.loaded / event.total;
  }
}
//下载
xhr.upload.onprogress = function () { }

xhr.load = () => { }  //传输成功完成。
xhr.abort = () => { } //传输被用户取消
xhr.error = () => { } //传输中出现错误。
xhr.loadstart = () => { } //传输开始。
xhr.loadEnd = () => { } //传输结束，但是不知道成功还是失败。
