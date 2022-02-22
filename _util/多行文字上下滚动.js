(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require(''));
  } else {
    root.returnExports = factory(root.jQuery);
  }
}(this || window, function () {
  function myFunc(container, target, ) {
    var wrap = document.querySelector(container);
    var target = document.querySelector(target);

    //计算行数
    function getLinesCount(element) {
      var prevLH = element.style.lineHeight;
      var factor = 1000;
      element.style.lineHeight = factor + 'px';
      var height = element.getBoundingClientRect().height;
      element.style.lineHeight = prevLH;
      return Math.floor(height / factor);
    }

    var count = getLinesCount(target);
    var lineHeight = Math.ceil(cc.offsetHeight / count);

    var startMove = function () {
      for (var i = 0; i < count; i++) {
        (function (i) {
          setTimeout(function () {
            cc.style.top = '-' + i * lineHeight + 'px';
            cc.style.opacity = '1';
          }, 2500 * i)
          setTimeout(function () {
            cc.style.opacity = '0';
          }, 2500 * i + 2200)
        })(i)
      }
    }

    wrap.style.height = lineHeight + 'px';

    startMove();
    setInterval(function () {
      startMove();
    }, 2500 * count)
  };

  return myFunc;
}));