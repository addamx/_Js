import { observe } from "./observer";
import Watcher from "./observer/watcher";

export function initState(vm) {
  const opts = vm.$options;

  // opts.props && initProps(vm);

  opts.methods && initMethods(vm);
  opts.data && initData(vm);
  opts.computed && initComputed(vm);
  opts.watch && initWatch(vm);
}

function initMethods(vm) {
  const methods = vm.$options.methods ?? {};
  Object.entries(methods).forEach(([key, method]) => {
    vm[key] = method.bind(vm);
  });
}

function initData(vm) {
  const data = vm._data = vm.$options.data?.() || {};
  observe(data);

  Object.keys(data).forEach(key => {
    proxy(vm, '_data', key);
  })
}

function initComputed(vm) {
  // function createComputedGetter(key) {
  //   return function computedGetter() {
  //     const watcher = vm._computedWatchers?.[key];
  //     if (watcher) {
  //       if (watcher.dirty) {
  //         watcher.evaluate();
  //       }
  //       if (Dep.target) {
  //         watcher.depend();
  //       }
  //       return watcher.value;
  //     }
  //   }
  // }

  const watchers = vm._computedWatchers = {};
  const computed = vm.$options.computed ?? {};
  Object.entries(computed).forEach(([key, fn]) => {
    watchers[key] = new Watcher(vm, fn, () => undefined);

    Object.defineProperty(vm, key, {
      get: fn.bind(vm),
      // get: createComputedGetter(key),
      set: () => undefined
    })
  })
}

function initWatch(vm) {
  const watch = vm.$options.watch ?? {};
  Object.entries(watch).forEach(([key, fn]) => {
    vm.$watch(key, fn.bind(vm));
  })
}


const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: () => undefined,
  set: () => undefined
}
export function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
    return undefined;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
