/**
 * # 基础类型
 */
// Boolean
let isDone: boolean = false;

// Number
let decLiteral: number  = 6;

// String
let title: string = "bob";

// Array (1)
let list1: number[] = [1, 2, 3];
// Array (2)
let list2: Array<number> = [1, 2, 3];

// Tuple (类型以及顺序要一致)
let x: [string, number];
x = ['hello', 10];
// x = [10, 'hello']; // ERR, 顺序不能乱

// e枚举num
enum Color {Red, Green, Blue};
  // enum Color {Red = 2 Green = 3, Blue = 5};
  // Color[3]; // === Color.Green
let c: Color = Color.Green;
// 常量枚举
const enum Color1 {Red, Green, Blue};
  //编译结果: let d = 1;
let d: Color1 = Color1.Green;

// Any
let notSure: any = 4;
notSure = 'a string';

// Void
function nothing(): void {
  console.log(1);
}
let unsuable: void = undefined;
unsuable = null;

// Null & Undefined
let u: undefined = undefined;
let n: null = null;

// Never
// 推断的返回值类型为never
function error(message: string): never {
  throw new Error(message);
}
// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {
  }
}

// Object (非原始类型, 除number，string，boolean，symbol，null或undefined之外的类型)
declare function create(o: object | null): void;

create({prop: 0});
create(null);





/**
 * # 类型断言
 *
 * 相当于其他语言里的类型转换, 如`(String)aNumberValue`(PHP)
 */
let someValue: any = 'a String';
let strLength1: number = (<string>someValue).length;  // 在JSX中无法使用
let strLength2: number = (someValue as string).length;




/**
 * 变量声明
 */
// 属性重命名
let o = {a: 11, b: 'test'};
let {a: aVal, b: bVal} = o; // aVal = 11, bVal = 'test';
// 默认值, 解构时可以加默认值
function keepWholeObject(wholeObject: {a: string, b?: number}) {
  let {a, b = 1001} = wholeObject;
}
