aQuery = function(selector, context) {
  //#001 通过aQuery.fn.init.prototype = aQuery.fn, init生成的实例this的指向仍然是aQuery.fn, 达到方法生成实例而不用new的目的
  return new aQuery.fn.init(selector, context);
}



aQuery.fn = aQuery.prototype = {
  //将静态方法拉过来和实例方法共享
  each: function( callback ) {
		return jQuery.each( this, callback );
	},
}
//添加实例方法1; 后面我们创建了extend方法, 可以更方便地添加实例方法
aQuery.testStatic = function(txt) {
  console.log(txt)
}


init = aQuery.fn.init = function( selector, context, root ) {
  
}
//**如果少了这句**, 在#001中init作为构造函数所生成实例和aQuery.fn将失去联系, 那么添加实例实例方法就必须在 aQuery.fn.init.protype上添加而不是aQuery.fn
aQuery.fn.init.prototype = aQuery.fn;


//为了方便地给aQuery对象添加实例方法, 使用extend方法;
aQuery.extend = aQuery.fn.extend = function(){
  //默认: aQuery.extend(target, obj1, obj2)
  var options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  //允许aQuery.extend(true, target, obj1, obj2), 标记为:深复制
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[i] || {};
    i++;
  }

  //不是对象, 数组或者函数
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }

  //只有一个对象, 则标记target为this, 用法:(1)aQuery.extend({...})添加静态方法, (2)aQeury.fn.extend({...})添加实例方法
  //1、当传入的参数只有一个(不能是true或者false),那么就扩展当前命名空间
  //2、当传入的参数有个两个,分别是深拷贝的开关(true或者false)和扩展参数,那么就扩展当前命名空间
  if (i === length) {
    target = this;
    i--;  //将待合并对象标记该对象
  }

  for(;i < length; i++) {//处理待合并对象
    if((options = argument[i]) != null) {
      for(name in options) {
        src = target[name];
        copy = options[name];

        //避免互相引用引起的循环
        if (target === copy) {
          continue;
        }

        //深复制, 属性值有效且位对象或者数组之一
        if(deep && copy && (aQuery.isPlainObejct(copy) || 
          (copyIsArray = Array.isArray(copy)))) {

            if(copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && aQuery.isPlainObejct(src) ? src : {};
            }
          
            target[name] = aQuery.extend(deep, clone, copy);

        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}

aQuery.isPlainObejct = function(obj) {
  var proto, Ctor;

  if (!obj || toString.call(obj) !== '[object Object]') {
    return false;
  }

  proto = getProto( obj );  //getProto = Object.getPrototypeOf

  //没有原型的对象, 如`Object.create(null)`
  //这样的对象, 连Object最基础的方法和属性都没有.
  if (!proto) {
    return true;
  }
  
  //判断有原型, 但是原型为Object, 而不是构造函数生成的对象; 即`Object(1), Object('a'), Object({}), new Object();`
  //`({}).hasOwnProperty.toString`和`Object.toString`一样
  //即: Object.toString.call(Object.getPrototypeOf(obj).constructor) === Object.toString.call(Object);  成立则说明obj的构造函数是Object
  Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;//hasOwn: ({}).hasOwnProperty,
  return typeof Ctor === 'function' &&
    fnToString.call(Ctor) === ObjectFunctionString  //fnToString: hasOwn.toString;  ObjectFunctionString = fnToString.call( Object );
}