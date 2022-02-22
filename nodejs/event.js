// `events`模块的`EventEmitter`是一个构造函数，可以用来生成事件发生器的实例emitter。
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var util = require('util');

/* 1. on , emit */
// 事件发生器的实例方法`on`用来监听事件，实例方法`emit`用来发出事件
// `addListener` 是`on`方法的别名
emitter.on('someEvent', function(){
    console.log('event has occurred')
});
(function(){
    console.log('emit start');
    emitter.emit('someEvent');
    console.log('emit end');
})()


/* 2.Emitter 接口的部署 */
function Dog(name) {
    this.name = name;
} 
// 继承EventEmitter
    //1.
Dog.prototype.__proto__ = EventEmitter.prototype;
    // 2. 另一种写法
    // Dog.prototype = Object.create(EventEmitter.prototype)
    // 3. Node 内置模块`util`的`inherits`方法，提供了另一种继承 Event Emitter 接口的方法。
// util.inherits(Dog, EventEmitter)
var simon = new Dog('simon');
simon.on('bark', function() {
    console.log(this.name + ' barked');
});
simon.emit('bark');


/* 
- once(name, f) 一次性监听
- listeners(name) 返回一个数组, 成员是事件name所有监听函数
- removeListener(name, f) 移除事件name的监听函数f
- removeAllListeners(name) 移除事件name
*/

/* setMaxListeners */
// 默认允许同一个事件最多可以指定10个回调函数。
emitter.setMaxListeners(20);



/* 默认事件 */
// 1.newListener 事件: 添加新的回调函数时触发
// 2.removeListener 事件: 移除回调时触发



/* 错误捕获 */
// 监听error
emitter.on('error', function(err) {
  console.error('出错：' + err.message);
});
// 如果没有上面的监听, 会直接抛出error, 导致程序直接停止
if (true) {
    emitter.emit('error', new Error('something bad happened'));
}
console.log('出错后continue....')


