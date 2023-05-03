import Dep from "./dep";

export class Observer {
  dep;

  constructor(value) {
    this.dep = new Dep();

    value.__ob__ = this;

    if (Array.isArray(value)) {
      //
    } else {
      Object.keys(value).forEach(key => {
        defineReactive(value, key);
      })
    }
  }
}


export function observe(value) {
  if (value && Object.prototype.hasOwnProperty.call(value, '__ob__') && value.__ob__ instanceof Observer) {
    return value.__ob__;
  }
  if (typeof value !== 'object') return;
  return new Observer(value);
}

export function defineReactive(obj, key, val) {
  const dep = new Dep();
  let value = val ?? obj[key];

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      if (Dep.target) {
        dep.depend();
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === value) return;
      value = newVal;
      dep.notify();
    }
  });

  return dep;
}
