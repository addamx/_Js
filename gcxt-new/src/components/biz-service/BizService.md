# BizService
1. 属性
modules
plugins


# Module

## 分类
1. 业务组件模块：渲染到页面，editForm、flow
2. 额外模块：业务领域，contract，project，detail

## 属性
1. name
2. model
3. servcie

```js
{
  name: '模块名',
  model: ModelClass,
  service
}
```

# Plugin
1. $Store
拿到module，生成页面用的store
暴露数据结构

2. $eventBus
"field_changed","editForm_changed","editForm_inited"
提供修改数据的方法

3. $effect
根据
1. 根据行为定义
eg.
```js
{
  name: 'get-contract',
  fun
}
```

4. $components
注册业务组件
  - 注入store

5. $hook
在$effect 执行前后添加hook

# 数据传输中
- 要不要DTO检查，转model
