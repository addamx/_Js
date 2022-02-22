/// <reference path="./base.d.ts" />

// 合并 interface
interface Foo {
  y: number;
}

let foo: Foo = {x: 1, y: 2};
console.log(foo.x + foo.y); // OK


// 合并 class + interface (类属性)
interface Boo {
  y: number;
}

let boo: Boo = new Boo();
console.log(boo.x + boo.y);



// 合并 class + namespace (静态属性)
namespace Boo {
  export let z: string;
}

let booz = Boo.z;





