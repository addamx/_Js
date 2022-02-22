import _throw from "@src/utils/errorHandler";

export default class PluginDriver {
  plugins = [];

  constructor(context, plugins) {
    if (context && Array.isArray(plugins)) {
      this.load(context, plugins);
    }
  }

  /**
   * 装载插件方法
   * @param {*} context 插件执行的上下文
   * @param {array} plugins 插件集合, 两种类型
   * 1.继承于formPlugin的实例, 取成员变量name
   * 2.函数类型, 取原型上的属性name
   */
  load(context, plugins, ...other) {
    /**
     * 关于插件方法的依赖参数(插件之间的数据依赖、对页面组件的依赖)
     *
     * plugin的声明方式，只能继承于[FormPlugin]
     */
    let assigner = {};

    for (let plugin of plugins) {
      // 过滤不规范的插件
      let internalType = _toString.call(plugin);
      if (internalType === "[object Object]") {
        // do nothing
      } else if (internalType === "[object Function]") {
        // 尝试实例化
        plugin = new plugin();
      } else {
        _throw(`不合法的plugin声明`, { silent: true });
        continue;
      }
      // 引用上下文
      plugin.context = context;

      if (!plugin.hasProperty("depends")) {
        _throw(`plugin：${plugin.name}未声明depends`, {
          silent: true
        });
      }
      let depends = plugin.depends || [];
      plugin.depends = depends;

      assigner[plugin.name] = plugin;
    }
    // 如果存在重名插件，将被覆盖
    Object.assign(this.plugins, assigner);
  }

  /**
   * 表单更新后，将变化通知插件
   * 解决插件间依赖问题
   * @param {*} newForm
   * @param {*} oldForm
   */
  invokePlugin() {
    // 记录插件执行结果
    const result = {};

    for (let name in this.plugins) {
      this.__exec(name, result);
    }
  }

  __exec(name, result) {
    if (name in this.result) {
      return this.result[name];
    }

    if (void 0 === this.plugins[name]) {
      _throw(`插件${name}不存在`);
    }

    let plugin = this.plugins[name];
    let { depends, context } = plugin;

    depends = depends.map(k => this.__exec(k, result));

    return (result[name] = Promise.all(depends).then(res => {
      return plugin.apply(context, res);
    }));
  }
}
