"use strict";
// namespace 相当于旧版 Typescript `Internal Module`
// namespace编译成最原始的闭包代码，技术原理最简单，兼容性也最好，特别适合把所有代码全部打包在一起的项目（顺序合并），不用每个文件写一堆import
exports.__esModule = true;
// - 同一namespace, 将引用同一上层作用域
var TopLev;
(function (TopLev) {
    var A = /** @class */ (function () {
        function A() {
        }
        A.prototype.isTrue = function () {
            return false;
        };
        return A;
    }());
    TopLev.A = A;
})(TopLev || (TopLev = {}));
(function (TopLev) {
    var B = /** @class */ (function () {
        function B() {
        }
        B.prototype.isTrue = function () {
            return true;
        };
        return B;
    }());
    TopLev.B = B;
})(TopLev || (TopLev = {}));
// namespace SecLev, 以及 class A/B/C, 如果不被export, 将没有机会被外部引用.
(function (TopLev) {
    var SecLev;
    (function (SecLev) {
        var C = /** @class */ (function () {
            function C() {
            }
            C.prototype.isTrue = function () {
                return true;
            };
            return C;
        }());
        SecLev.C = C;
    })(SecLev = TopLev.SecLev || (TopLev.SecLev = {}));
})(TopLev || (TopLev = {}));
// console.log(TopLev.SecLev.C)
// 顶层的namespace不需要export, 因为它已经创建了全局变量`TopLev2`, 如果使用了export, 那就和 ES6`export module`没区别.
var TopLev2;
(function (TopLev2) {
    var C = /** @class */ (function () {
        function C() {
        }
        return C;
    }());
    TopLev2.C = C;
})(TopLev2 = exports.TopLev2 || (exports.TopLev2 = {}));
// 等同于
var TopLev3;
(function (TopLev3) {
    var C = /** @class */ (function () {
        function C() {
        }
        return C;
    }());
    TopLev3.C = C;
})(TopLev3 = exports.TopLev3 || (exports.TopLev3 = {}));
// 同一namespace 但放在不同文件时
// 1. 可以使用 --outfile 合成一个文件
// 2. 或者按照顺序导入
// 最好按照顺序, 标注 `<reference ...>`关系, 在用--outfile合成同一文件时, 只需指定最后一个文件
