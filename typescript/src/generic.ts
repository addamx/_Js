
/**
 * https://zhuanlan.zhihu.com/p/60953568
 * 1. 声明泛型容器或组件。比如：各种容器类Map、Array、Set等；各种组件，比如React.Component。
 * 2. 对类型进行约束。比如：使用extends约束传入参数符合某种特定结构。
 * 3. 生成新的类型。
 *
 * T: 代表类型变量
 */


/**
 * 泛型函数
 *
 * 泛型T让参数和返回值保持一样的类型
 */
function identity<T>(arg: T): T {
  return arg;
}
// 使用`<>`, 明确T为string类型
let output = identity<string>("myString")
// 简单场景可以直接使用, 利用编辑器的类型推论
let output1 = identity("myString");

// 把T指向参数数组元素的类型
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);  // Array has a .length, so no more error
  return arg;
}




/**
 * 泛型类型
 */
let myIdentity: <T>(arg: T) => T = identity;
// 不用参数名也行
let myIdentity2: <U>(arg: U) => U = identity;

interface GenericIdentityFn {
  <T>(arg: T): T;
}
let myIdentity3: GenericIdentityFn = identity;
//加入`泛型参数`
interface GenericIdentityFn2<T> {
  (arg: T): T;
}
let myIdentity4: GenericIdentityFn2<string> = identity;





/**
 * 泛型类
 *
 * 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。
 */
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };




/**
 * 泛型约束
 */

interface Lengthwise {
  length: number;
}
// 对泛型进行约束
function loggingIdentity2<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
// keyof T 返回 T的联合类型, K extends keyof T, 则 K 必须是 T的一个属性
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
// 在工厂函数中使用泛型类类型
function create1<T>(c: {new(): T; }): T {
  return new c();
}

// 工厂函数 (继承)
class ZooKeeper {
  nametag: string;
}

class Animall {
  numLegs: number;
}

class Lion extends Animall {
  keeper: ZooKeeper;
}
// 确保 A 继承自 Animall
function createInstance<A extends Animall>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag;
