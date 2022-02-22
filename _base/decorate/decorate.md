# 准备
## 安装
`npm i babel-plugin-transform-decorators-legacy babel-register --save-dev`



## 运行
1. require hook
配置babel
```js
require('babel-register')({
    plugins: ['transform-decorators-legacy']
});
require("./app.js")
```
执行命令行
`node complie.js`

2. 命令行
`babel --plugins transform-decorators-legacy ...`
或
`babel-node --plugins transform-decorators-legacy ...`

3. `.babelrc`
```json
{
  "plugins": ["transform-decorators-legacy"]
}
```

# 注意
- 修饰器只能用于类和类的方法，不能用于函数，因为存在函数提升
- 如果一定要修饰函数，可以采用高阶函数的形式直接执行
```js
function doSomething(name) {
  console.log('Hello, ' + name);
}

function loggingDecorator(wrapped) {
  return function() {
    console.log('Starting');
    const result = wrapped.apply(this, arguments);
    console.log('Finished');
    return result;
  }
}

const wrapped = loggingDecorator(doSomething);
```


# 应用
- 实际开发中，React 与 Redux 库结合使用时，常常需要写成下面这样。
```jsx
class MyReactComponent extends React.Component {}
export default connect(mapStateToProps, mapDispatchToProps)(MyReactComponent);
```
使用修饰器可以修改成
```jsx
@connect(mapStateToProps, mapDispatchToProps)
export default class MyReactComponent extends React.Component {}
```

- mixins方法, 但是比起extends, mixins会修改原型
```js
function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list);
  };
}

const Foo = {
  foo() { console.log('foo') }
};

@mixins(Foo)
class MyClass {}
```

