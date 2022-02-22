/*
1. assert方法接受两个参数，当第一个参数对应的布尔值为true时，不会有任何提示，返回undefined。当第一个参数对应的布尔值为false时，会抛出一个错误，该错误的提示信息就是第二个参数设定的字符串。
*/
var assert = require('assert');

function add(a, b) {return a + b;}
var expected = add(1,2);

/* 1.asset(), ok, equal  */
// 以下三句效果相同
// equal 方法内部使用的是相等运算符（==）
assert(expected == 3, '预期1+2等于3');
assert.ok(expected == 3, '预期1+2等于3');
assert.equal(expected, 3, '预期1+2等于3');

/* 2.notEqual */
// notEqual 方法内部使用不相等运算符（!=），而不是严格不相等运算符（!==）
assert.notEqual(expected, 4, '预期不等于4');

/* 3.deepEqual */
//deepEqual 方法用来比较两个对象。只要它们的属性一一对应，且值都相等，就认为两个对象相等
var list1 = [1, 2, 3, 4, 5];
var list2 = [1, 2, 3, 4, 5];

assert.deepEqual(list1, list2, '预期两个数组应该有相同的属性');

var person1 = { "name":"john", "age":"21" };
var person2 = { "name":"john", "age":"21" };

assert.deepEqual(person1, person2, '预期两个对象应该有相同的属性');

/* 4.notDeepEqual */
//assert.notDeepEqual()与deepEqual方法正好相反，用来断言两个对象是否不相等。

/* 5. strictEqual notStrictEqual */
//strictEqual 方法使用严格相等运算符（===），比较两个表达式。
//notStrictEqual 方法使用严格不相等运算符（!==），比较两个表达式

/* 6.throws */
// 格式  assert.throws(block, [error], [message])

// 例一，抛出的错误符合某个构造函数
assert.throws(
  function() {
    throw new Error("Wrong value");
  },
  Error,
  '不符合预期的错误类型'
);

// 例二、抛出错误的提示信息符合正则表达式
assert.throws(
  function() {
    throw new Error("Wrong value");
  },
  /value/,
  '不符合预期的错误类型'
);

// 例三、抛出的错误符合自定义函数的校验
assert.throws(
  function() {
    throw new Error("Wrong value");
  },
  function(err) {
    if ( (err instanceof Error) && /value/.test(err) ) {
      return true;
    }
  },
  '不符合预期的错误类型'
);


/* 7.doesNotThrow */
// doesNotThrow 方法与throws方法正好相反，预期某个代码块不抛出错误。
assert.doesNotThrow(
  function() {
    console.log("Nothing to see here");
  },
  '预期不抛出错误'
);

/* 8.ifError */
//ifError 方法断言某个表达式是否false，如果该表达式对应的布尔值等于true，就抛出一个错误。它对于**验证回调函数的第一个参数**十分有用，如果该参数为true，就表示有错误。
// 用法
function sayHello(name, callback) {
  var error = false;
  var str   = "Hello "+name;
//   error = true;

  callback(error, str);
}

// use the function
sayHello('World', function(err, value){
  assert.ifError(err);
  // ...
})

/* 9.fail */
// fail方法用于抛出一个错误。不管参数是什么值，它总是抛出一个错误
// 格式 assert.fail(actual, expected, message, operator)
// 如果message参数对应的布尔值不为false，抛出的错误信息就是message，否则错误信息就是“实际值 + 分隔符 + 预期值”

assert.fail(21, 41, 'Test Failed', '###')
// AssertionError: Test Failed
assert.fail(21, 21, 'Test Failed', '###')
// AssertionError: Test Failed
assert.fail(21, 42, undefined, '###')
// AssertionError: 21 ### 42
