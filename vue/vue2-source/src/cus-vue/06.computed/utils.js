export function def(obj, key, value, enumerable = true) {
  Object.defineProperty(obj, key, {
    value,
    writable: true,
    configurable: false,
    enumerable,
  })
}

