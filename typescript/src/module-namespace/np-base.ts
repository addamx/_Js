// namespace 相当于旧版 Typescript `Internal Module`
// namespace编译成最原始的闭包代码，技术原理最简单，兼容性也最好，特别适合把所有代码全部打包在一起的项目（顺序合并），不用每个文件写一堆import


// - 同一namespace, 将引用同一上层作用域
namespace TopLev {
  export class A {
    isTrue() {
      return false;
    }
  }
}


namespace TopLev {
  export class B {
    isTrue() {
      return true;
    }
  }
}

// namespace SecLev, 以及 class A/B/C, 如果不被export, 将没有机会被外部引用.

namespace TopLev {
  export namespace SecLev {
    export class C {
      isTrue() {
        return true;
      }
    }
  }
}

// console.log(TopLev.SecLev.C)

// 顶层的namespace不需要export, 因为它已经创建了全局变量`TopLev2`, 如果使用了export, 那就和 ES6`export module`没区别.
export namespace TopLev2 {
  export class C {
  }
}
// 等同于
export module TopLev3 {
  export class C {
  }
}


// namespace 情景
// 全局库
// 如, jquery有一个"jQuery"的全局变量, 为了加声明, 可以:
declare namespace jQuery {
  export class C {}
}



// 同一namespace 但放在不同文件时
// 1. 可以使用 --outfile 合成一个文件
// 2. 或者按照顺序导入
// 最好按照顺序, 标注 `<reference ...>`关系, 在用--outfile合成同一文件时, 只需指定最后一个文件
