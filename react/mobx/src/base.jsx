import {
  toJS,
  observable,
  isArrayLike,
  extendObservable,
  computed,
  autorun,
  when,
  reaction,
  action,
  runInAction
} from "mobx";

/**
 * base
 */
const obj = observable({ d: "a", e: "b", f: "c" });
const arr = observable([1, 2, 3]);
const map = observable(new Map());

isArrayLike(arr); //true
arr.pop();
arr[0];

//无论是observable的对象, 还是原生对象, 最佳实践都是将可能用到的属性填加上
//注意: observable.object(object) 实际上是 extendObservable({}, object) 的别名。
extendObservable(obj, { g: "z" });

toJS(obj); //{d: "a", e: "b", f: "c", g: "z"}

// 基本型数据
// observable.box

var num = observable.box(20);
num.get();
num.set(10);

/**
 * class - decorators
 */
class Store {
  @observable array = {};
  @observable obj = {};
  @observable map = new Map();

  // @obserable 会检测是否为基本类型, 如果是, 则自动使用 observable.box 处理
  @observable string = "hello";
  @observable number = 20;
  @observable bool = true;

  @computed
  get mixed() {
    return store.string + "/" + store.number;
  }

  // 配合reaction, 下面修改了2次, 但reaction只会触发1次
  // @action.bound 会将方法绑定到实例
  @action
  Bar() {
    this.string = "world";
    this.number = 40;
  }
}

var store = new Store();

// 重新赋值一样的值, 是无法触发 observe函数, when, reaction,
// 但 autorun 仍会触发;

/**
 * computed
 */
var aComputed = computed(function() {
  return store.string + "/" + store.number;
});
aComputed.get(); // 'hello/20'
aComputed.observe(function(change) {
  console.log(change);
});
// 以下将产生2次'update'的observe信息
store.string = "world";
store.number = 30;

/**
 * autorun
 * 在可观察数据每一次变化后, 触发行为;
 */
autorun(() => {
  console.log(store.mixed);
});
store.string = "world";
store.number = 30;

/**
 * when
 * 第一个参数的返回值必须是可观察数据, 否则什么都不会发生;
 * 成功执行一次后就不再重新触发
 */
console.log("before");
when(() => store.bool, () => console.log("it's ture"));
console.log("after");
// before
// it's ture    //无论是否去修改, 都会至少执行一次, 否则mobx无从知道有哪些可观察数据
// after
store.bool = false;
store.bool = true;
// 没有再触发

/**
 * reaction
 * 告知mobx有哪些可观察数据, 就不会像 when 那样至少执行一次了.
 */
reaction(() => [store.string, store.number], arr => console.log(arr.join()));
store.string = "world";
store.number = 30;
// 触发2次
// world,20
// world,30

// 触发1次, @action打包的方法, 即使有多次修改, 也只触发reaction的一次触发
store.Bar();
// world,30

// @action的全局版
// 'modify' 可选
runInAction("modify", () => {
  store.string = "test";
  store.number = 50;
});

export default {};
