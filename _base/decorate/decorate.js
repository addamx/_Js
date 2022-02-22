@addSkill
class Person {}
function addSkill(target, name, descriptor) {
  target.say = "hello world";
}
console.log(Person.say)




console.log('\n============带参数的修饰器===================')

/**
 * 带参数的修饰器
 * @param {bool} isTestable 
 */
function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}
console.log(MyTestableClass.isTestable) // true

@testable(false)
class MyClass {}
console.log(MyClass.isTestable) // false




console.log('\n=============修改类对象的原型==================')

function testablee(target) {
  target.prototype.isTestable = true;
}

@testablee
class MyTestableClasss {}

let obj = new MyTestableClasss();
console.log(obj.isTestable) // true





console.log('\n=============修改类对象的方法==================')

class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

function log(target, name, descriptor) {
  //console.log(target, '~' , name, '~', descriptor)
  /**
   * target: Math {}
   * name: 'add',
   * descriptor: 
      {
          value: [Function: add],
          writable: true,
          enumerable: false,
          configurable: true
      }
   */
  //这里是类的方法函数
  var oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling ${name} with`, arguments);
    return oldValue.apply(null, arguments);
  };

  return descriptor;
  
}

const math = new Math();
math.add(2, 4);




console.log('\n=============多个修饰器==================')
/*
先从外到内进入，然后由内向外执行。
*/
function dec(id){
  console.log('evaluated', id);
  return (target, property, descriptor) => console.log('executed', id);
}

class Example {
    @dec(1)
    @dec(2)
    method(){}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1