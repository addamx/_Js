export function def(obj, key, value, enumerable = true) {
  Object.defineProperty(obj, key, {
    value,
    writable: true,
    configurable: false,
    enumerable,
  })
}

export function hoistProperty(target, sourceKey) {
  Object.keys(target[sourceKey]).forEach(key => {
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get() {
        return this[sourceKey][key]
      },
      set(val) {
        return this[sourceKey][key] = val;
      }
    })
  })
}


export function genGetterByPath(path) {
  const segments = path.split('.');
  return (obj) => segments.reduce((pre, cur) => pre[cur], obj)
}
