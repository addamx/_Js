- ` callHook(vm, 'beforeMount')` 全局钩子？
- performance




---

# new Vue(...)
- `this_init()`
  - 

# 触发 App render
- `new Vue(...).$mount('#app')` 触发 $mount -> mountComponent
- mountComponent 建立 `new Watcher`
  - mountComponent 的工作
    1. 触发 callHook(vm, 'beforeMount') 钩子
    2. 建立一个Watcher，将当前 `vnode` 与 `vm._update(vm._render())`绑定
- Watcher实例化时，执行一次上面传入的`vm._update(vm._render())`
- `vm._update(vm._render())`
  - vm_render，即`Vue.prototype._render`，用于根据`this`的`render`方法初始化 vnode
  - vm_update 主要是执行 `vm.__patch__`，`__patch__` 对比新旧vnode(可能是旧vnode，也可能是旧dom，这里是旧dom(#app))，给 vm_render 创建的vnode 赋值 elm属性，指向真实的dom
     - createElm 给 vnode 创建elm时，如果vnode是个组件，会初始化component，会通过`init`方法法来创建 component实例，然后执行实例的$mount方法
     - $mount -> mountComponent，



# 参考
- `h`函数，对应 `vm.$createElement`
