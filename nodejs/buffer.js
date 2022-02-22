/* 基本使用 */
// 生成一个256字节的Buffer实例
var bytes = new Buffer(256);

for (var i = 0; i < bytes.length; i++) {
  bytes[i] = i;
}
    // 生成一个buffer的view
    // 从240字节到256字节
var end = bytes.slice(240, 256);
end[0] // 240
end[0] = 0;
end[0] // 0

/* copy */
var more = new Buffer(16);
//将bytes实例的1号成员到16号成员的这一段，都拷贝到了more实例从0号成员开始的区域。
bytes.copy(more, 0, 1, 16);
console.log(more[14]);  //15

/*
Buffer对象支持以下编码格式:
ascii
ascii
utf8
utf16le：UTF-16的小端编码，支持大于U+10000的四字节字符。
ucs2：utf16le的别名。
base64
hex：将每个字节转为两个十六进制字符。
*/


/* 二进制数组 */
// `TypedArray`构造函数可以接受`Buffer`实例作为参数，生成一个二进制数组。
var typedArray = new Uint32Array(new Buffer([1, 2, 3, 4]));


/* 构造函数 */
// 参数是整数，指定分配多少个字节内存
var hello = new Buffer(5);
// 参数是数组，数组成员必须是整数值
var hello = new Buffer([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
console.log(hello.toString()) // 'Hello'
// 参数是字符串（默认为utf8编码）
var hello = new Buffer('Hello');
hello.length // 5
console.log(hello.toString()) // "Hello"
// 参数是字符串（不省略编码）
var hello = new Buffer('Hello', 'utf8');
// 参数是另一个Buffer实例，等同于拷贝后者
var hello1 = new Buffer('Hello');
var hello2 = new Buffer(hello1);


/* 读取文件 */
var fs = require('fs');
var buffer = new Buffer(1024);

var readSize = fs.readSync(fs.openSync('./_text', 'r'), buffer, 0, 1024);
var chunk = buffer.toString('utf8', 0, readSize);
console.log('INPUT: ' + chunk);

// isEncoding 是否为指定编码。
    Buffer.isEncoding('utf8') // true

// isBuffer 是否为Buffer实例
    Buffer.isBuffer(Date) //false

//  byteLength 字符串实际占据的字节长度
    Buffer.byteLength('Hello', 'utf8') // 5

// concat 将一组Buffer对象合并为一个Buffer对象。
    var i1 = new Buffer('Hello');
    var i2 = new Buffer(' ');
    var i3 = new Buffer('World');
    Buffer.concat([i1, i2, i3]).toString()  // 'Hello World'
    //第二个参数，指定合并后Buffer对象的总长度。省略第二个参数时，Node内部会计算出这个值，然后再据此进行合并运算。因此，显式提供这个参数，能提供运行速度。
    console.log(Buffer.concat([i1, i2, i3], 10).toString()) // 'Hello Worl'



/* 实例方法 */
// write 方法可以向指定的Buffer对象写入数据; 第三个参数（可省略）是编码方式，默认为utf8
var buf = new Buffer(5);
buf.write('He');
buf.write('l', 2);
buf.write('lo', 3);

// slice(起始位置, 终止位置)
