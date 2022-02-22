import module from "./module";

/**
 * 页面组件控制器
 * 初始化组件树所需的数据
 * 生成组件mixins
 */
export default class BizService {
  constructor(bizComponent) {
    this.modules = new Map();
    this.isInited = false;
  }
  static use(plugin) {
    plugin.init(this);
  }
  /**
   * 注册模块类
   */
  register(module) {
    const { name } = module;
    if (!this.modules.has(name)) {
      this.modules.set(name, module);
      if (this.isInited) {
        module.init();
      }
    }
  }
  init() {
    this.modules.forEach(module => {
      module.init();
    });
    this.isInited = true;
  }
  execAction(fnName, ...args) {

  }
  getComponentInstance(fieldId) {

  }
}

export {
  // 业务模块原型
  module
};
