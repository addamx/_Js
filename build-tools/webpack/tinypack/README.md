> https://github.com/chinanf-boy/minipack-explain/blob/master/src/minipack.js

- AST test: http://esprima.org/demo/parse.html#
```
type:描述该语句的类型 --变量声明语句
kind：变量声明的关键字 -- var
declaration: 声明的内容数组，里面的每一项也是一个对象
    type: 描述该语句的类型 
    id: 描述变量名称的对象
        type：定义
        name: 是变量的名字
        init: 初始化变量值得对象
        type: 类型
        value: 值 "is tree" 不带引号
        row: "\"is tree"\" 带引号
```

- 导出整体
```js
(function(modules) {
  // ...
})({
 // ...
})
```

- 导出的module集合
```js
{
  "./src/index.js": function(module, exports, __webpack_require__) {
    eval(
      '__webpack_require__("./src/moduleA.js")'
      /*....*/
    )
  },
  "./src/moduleA.js": function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);
    var _moduleB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/moduleB/index.js");

    function world () {
      return {
        name: 'world',
        value: _moduleB__WEBPACK_IMPORTED_MODULE_0__["default"]
      };
    }
  },
  "./src/moduleB.js": function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);

    const value = 11;

    __webpack_exports__["default"] = (value);
  },
}

```

