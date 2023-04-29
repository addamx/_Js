import { observe } from "./observer";

export function initState(vm) {
  const opts = vm.$options;

  // opts.props && initProps(vm);

  opts.methods && initMethods(vm);
  opts.data && initData(vm);
  // opts.computed && initComputed(vm);
  // opts.watch && initWatch(vm);
}

function initMethods(vm) {
  const methods = vm.$options.methods ?? {};
  Object.entries(methods).forEach(([key, method]) => {
    vm[key] = method.bind(vm);
  });
}

function initData(vm) {
  const data = vm._data = vm.$options.data?.() || {};
  const ob = observe(data);
  ob && ob.vmCount++;

  Object.keys(data).forEach(key => {
    proxy(vm, '_data', key);
  })
}

function initComputed(vm) {
  const computed = vm.$options.computed ?? {};
  Object.entries(computed).forEach(([key, fn]) => {
    Object.defineProperty(vm, key, {
      get: fn.bind(vm),
      set: () => undefined
    })
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
