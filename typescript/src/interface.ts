/**
 * 接口 (参数)
 */
interface ArugmentList {
  label: string;  // 必需属性
  width?: number; // 可选属性
  readonly name: string;  //只读属性
}

function printLabel(labelObj: ArugmentList) {
  console.log(labelObj.label);
  // console.log(labelObj.extra);  // ERROR, 未在接口声明的属性无法被利用
  // labelObj.name = 'test'; //ERROR, name attribute is read-only
}

// !!! 这样调用会传入接口未声明类型的属性而没有提示
let vals = {label: 'test', width: 100, name: 'name', extra: 1000};
let mySquares = printLabel(vals);

// ERROR, 只能传入已接口的属性
// let mySquaress = printLabel({label: 'test', width: 100, name: 'name', extra: 1000});

// 类型断言, 强行传入额外的属性
let mySquaresss = printLabel({label: 'test', width: 100, name: 'name', extra: 1000} as ArugmentList);

// ! 或者在接口中添加`字符串索引签名`

interface NewArugmentList {
  label: string;
  width?: number;
  readonly name: string;
  [propName: string]: any;  // 字符串索引签名`
}






/**
 * 接口 (函数)
 */
interface SearchFunc {
  // (参数): 返回值
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
// 参数名不一定要和接口一直, 这里用 src, sub 也行 function(src: string, sub: string)
// 参数不在声明类型也行, TS一样会检查参数类型; function(source, subString)
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}




/**
 * 索引类型
 *
 * Typescript支持两种索引签名：字符串和数字
 */
interface StringArray {
  [index: number]: string;
}
let myArray: StringArray = ['a', 'b'];

interface StringDict {
  [index: string]: string;
}
let myDict: StringDict = {'first-name': 'Tom', age: '16'};





/**
 * 类类型
 *
 */
interface ClockInterface {
  currentTime: Date;
  // new (hour: number, minute: number);  // 类接口只针对实例的属性方法, constructor属于静态, 不在检查范围内
}
// constructor (静态方法)的接口要单独声明
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

const ClockIns: ClockConstructor = class Clock implements ClockInterface {

  currentTime: Date;

  setTime(d: Date) {
    this.currentTime = d;
  }

  constructor(h: number, m: number) {

  };
}

// constructorInterface或用在Factory函数
function clockFactory(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
  return new ctor(hour, minute);
}




/**
 * 接口继承
 */
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;




/**
 * 混合类型
 *
 * 同时作为函数和对象使用
 */
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = <Counter>function (start: number): string { return '' };
  counter.interval = 123;
  counter.reset = function () { };
  return counter;
}




/**
 * 接口继承类
 */
class Control {
  private state: any;
}
// 接口可以从类中继承声明
// 同时因为有 私有属性 state, 这也要求了必须是Control的子类才能通过该接口的检查
interface SelectableControl extends Control {
  select(): void;
}
// Contro子类才能通过检查
class Button extends Control implements SelectableControl {
  select() { }
}

// 假设Control的state是public, 则只需要添加state属性也可以通过检查
// Error: Property 'state' is missing in type 'Imagex'.
// class Imagex implements SelectableControl {
//   select() { }
//   state: 11;
// }
