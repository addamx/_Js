/**
 * UMD: 通用模块规范
 * http://web.jobbole.com/82238/
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD
      define(['jquery'], factory);
  } else if (typeof exports === 'object') {
      // Node, CommonJS之类的
      module.exports = factory(require('jquery'));
  } else {
      // 浏览器全局变量(root 即 window)
      root.returnExports = factory(root.jQuery);
  }
}(this, function ($) {
  //    方法
  function myFunc(){};

  //    暴露公共方法
  return myFunc;
}));