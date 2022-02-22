/**
 * 通用的惰性单例
 */
var getSingle = function (fn) {
  var result;
  return function () {
    return result || (result = fn.apply(this, arguments));
  }
}

/**
 * 缓存代理
 */
var createProxyFactory = function(fn) {
  var cache = {};
  return function() {
    var args = Array.prototype.join.call(arguments, ',');
    if (args in cache) {
      return cache[args];
    }
    return cache[args] = fn.apply(this, arguments);
  }
}




/**
 * 分批执行函数
 * @param {数组} ary 
 * @param {处理函数} fn 
 * @param {每次操作的个数} count 
 */
var timeChunk = function(ary, fn, count) {
  var obj, t;
  var len = ary.length;
  var start = function() {
    for (var i = 0; i < Math.min(count || 1, ary.length); i++) {
      var obj = ary.shift();
      fn(obj);
    }
  }

  return function() {
    t = setInterval(function(){
      if (ary.length === 0) {
        return clearInterval(t);
      }
      start()
    }, 200)
  }
}



/**
 * 事件代理:
 * 1. 减少了访问 DOM 的次数，提升了性能；
 * 2. 将子元素的事件处理程序统一绑定到其父元素，减少了对内存的占用；
 * 3. 可以更好地管理事件处理程序，比如移除对某个事件处理程序的引用
 * 接收两种调用方式 bindEvent(div1, 'click', 'a', function () {...}) 和 bindEvent(div1, 'click', function () {...}) 这两种
 */
var bindEvent = function(elem, type, selector, fn) {
  if (fn == null) {
      fn = selector
      selector = null
  }

  elem.addEventListener(type, function (e) {
      var target
      if (selector) {
          // 有 selector 说明需要做事件代理
          target = e.target
          if (target.matches(selector)) {
              fn.call(target, e)
          }
      } else {
          // 无 selector ，说明不需要事件代理
          fn(e)
      }
  })
}



/**
 * 动画(类)
 */
var tween = {
  linear: function( t, b, c, d ){
    return c*t/d + b;
  },
  easeIn: function( t, b, c, d ){
    return c * ( t /= d ) * t + b;
  },
  strongEaseIn: function(t, b, c, d){
    return c * ( t /= d ) * t * t * t * t + b;
  },
  strongEaseOut: function(t, b, c, d){
    return c * ( ( t = t / d - 1) * t * t * t * t + 1 ) + b;
  },
  sineaseIn: function( t, b, c, d ){
    return c * ( t /= d) * t * t + b;
  },
  sineaseOut: function(t,b,c,d){
    return c * ( ( t = t / d - 1) * t * t + 1 ) + b;
  }
};
var Animate = function (dom) {
  this.dom = dom;
  this.startTime = 0;
  this.startPos = 0;
  this.endPos = 0;
  this.propertyName = null; //dom节点需要改变的css属性;
  this.easing = null; //缓动算法
  this.duration = null;
}
Animate.prototype.start = function (propertyName, endPos, duration, easing) {
  this.startTIme = +new Date;
  this.startPos = this.dom.getBoundingClientRect()[propertyName]; //dom节点初始位置
  this.propertyName = propertyName;
  this.endPos = endPos;
  this.duration = duration;
  this.easing = tween[easing];

  var self = this;
  var timeId = setInterval(function () {
    if (self.step() === false) {
      clearInterval(timeId);
    }
  }, 19);
}

Animate.prototype.step = function () {
  var t = +new Date;
  if (t >= this.startTime + this.duration) {
    this.update(this.endPos);
    return false;
  }
  var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
  this.update(pos);
};

Animate.prototype.update = function (pos) {
  this.dom.style[this.propertyName] = pos + 'px';
};
