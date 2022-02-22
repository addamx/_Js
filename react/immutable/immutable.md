# ref:
https://juejin.im/post/5948985ea0bb9f006bed7472


# immutable.js主要有三大特性：
- Persistent data structure （持久化数据结构）
> 修改时保持前的状态
- structural sharing （结构共享）
> Immutable对象进行操作的时候，ImmutableJS会只clone该节点以及它的祖先节点，其他保持不变，这样可以共享相同的部分，大大提高性能。
- support lazy operation （惰性操作


# 优缺点
## 优点：

1. 降低mutable带来的复杂度
2. 节省内存
3. 历史追溯性（时间旅行）：时间旅行指的是，每时每刻的值都被保留了，想回退到哪一步只要简单的将数据取出就行，想一下如果现在页面有个撤销的操作，撤销前的数据被保留了，只需要取出就行，这个特性在redux或者flux中特别有用
4. 拥抱函数式编程：immutable本来就是函数式编程的概念，纯函数式编程的特点就是，只要输入一致，输出必然一致，相比于面向对象，这样开发组件和调试更方便

## 缺点：

1. 需要重新学习api
2. 资源包大小增加（源码5000行左右）
3. 容易与原生对象混淆：由于api与原生不同，混用的话容易出错。



# react + readucx + immutableJs
- `fromJS()` 和 `toJS()` 是深层的互转immutable对象和原生对象，性能开销大，尽量不要使用;
- 单层数据转换使用`Map()`和`List()`
- redux 的`combineReducers`只支持state是原生的Js; 所以需要redux-immutable提供的`combineReducers`替代它
- 所有针对immutable变量的增删改必须左边有赋值，因为所有操作都不会改变原来的值，只是生成一个新的变量
- `Map`类型的key必须是string
- 深层深套对象的值时不需要做每一层级的判空
```js
//js
var obj = {a:1}
var res = obj.a.b.c   //error

//immutable
var immutableData=immutable.fromJS(obj
var res = immutableData.getIn(['a', 'b', 'c'])  //undefined
```
- immutable对象直接可以转JSON.stringify(),不需要显式手动调用toJS()转原生
- 调试过程中要看一个immutable变量中真实的值，可以chrome中加断点，在console中使用`.toJS()`方法来查看
