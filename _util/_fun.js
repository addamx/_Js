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
 * 动画
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
