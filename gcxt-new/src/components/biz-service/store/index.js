export default class Store {
  constructor() {
    this.store = {};
  }
  install(bizService) {
    bizService.modules.forEach(module => {
      const { name, model } = module;
      this.store[name] = model();
    });
  }
  get(strKeys, state) {
    if (state === undefined) {
      state = this.store;
    }
    const keys = strKeys.split(".");
    return keys.reduce((prev, cur) => {
      if (typeof prev !== "object") {
        throw new Error("store.get: 无法获取目标值");
        // return undefined;
      }
      return prev[cur];
    }, state);
  }
  set(strKeys, value, state) {
    if (state === undefined) {
      state = this.store;
    }
    const keys = strKeys.split(".");
    const lastIndex = keys.length - 1;
    keys.reduce((prev, cur, index) => {
      if (typeof prev !== "object") {
        throw new Error("store.set: 无法设置目标值");
      }
      if (index === lastIndex) {
        prev[cur] = value;
      }
      return prev[cur];
    }, state);
  }
}
