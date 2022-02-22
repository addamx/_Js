// http://www.bingshangroup.com/blog/2019/12/09/zhou/IoC/
// http://www.bingshangroup.com/blog/2019/12/09/zhou/DI/
// https://angular.cn/guide/dependency-injection-providers
// https://github.com/angular/di.js
// https://juejin.im/post/590d5f502f301e006c145f01
// https://zhuanlan.zhihu.com/p/72323250
// https://zhuanlan.zhihu.com/p/53832991

import Injectable from "./Injectable";
import { InstanceType } from "./constants";

const defaultProvideConfig = {
  type: InstanceType.singleton
};

/**
 *
 */
export default class Ioc {
  constructor(config = {}) {
    this.providerMap = new Map();
    const { provide: provideConfig = {} } = config;
    // init injectable/provide config
    this.provideConfig = {
      ...defaultProvideConfig,
      ...provideConfig
    };
  }

  /**
   * 注册
   */
  injectable() {
    return Creator => {
      if (typeof Creator !== "function") {
        throw new Error(`请注入函数`);
      }
      const { name } = Creator;
      if (!this.has(name)) {
        const injectable = new Injectable(name, Creator);
        this.providerMap.set(name, injectable);
      }
    };
  }
  inject(...dependencies) {
    return Creator => {
      const { name } = Creator;
      if (this.providerMap.has(name)) {
        const curInjectable = this.providerMap.get(
          name,
          new Injectable(name, Creator)
        );
        curInjectable.dependencies = dependencies;
      } else {
        throw new Error("请注册当前类再声明依赖");
      }
    };
  }
  has(token) {
    return this.providerMap.has(token);
  }
  get(providers) {
    let providerToken;
    let curProvideConfig;

    return providers.map(arg => {
      if (arg === undefined || arg === null) return;

      if (typeof arg === "string") {
        providerToken = arg;
        curProvideConfig = this.provideConfig;
      } else if (typeof arg === "object" && arg.token) {
        const { token, ...rest } = arg;

        providerToken = token;
        curProvideConfig = {
          ...this.provideConfig,
          ...(rest || {})
        };
      }
      const isExisted = this.has(providerToken);
      if (!isExisted) {
        throw new Error(`该 provider token 不存在：${providerToken}`);
      }
      return this.getPerProvider(providerToken, curProvideConfig);
    });
  }
  getPerProvider(token, config) {
    const { type } = config;
    const injectable = this.providerMap.get(token);
    const { Creator, cache, dependencies } = injectable;
    let constructorArgs = [];
    if (dependencies.length) {
      constructorArgs = this.get(dependencies);
    }
    switch (type) {
      case InstanceType.singleton:
        if (cache) {
          return cache;
        } else {
          const instance = new Creator(...constructorArgs);
          injectable.cache = instance;
          return instance;
        }
      case InstanceType.normal:
      /* fall through */
      default:
        return new Creator(...constructorArgs);
    }
  }
}

export {};
