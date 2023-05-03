import { def } from "./utils";

export class Dep {
  static target;
  watchers;

  constructor() {
    this.watchers = new Set();
  }

  depend() {
    if (Dep.target) {
      this.watchers.add(Dep.target)
    }
  }

  notify() {
    this.watchers.forEach(watcher => watcher())
  }
}

export function AddDepTarget(watcher) {
  Dep.target = watcher;
}
export function RemoveDepTarget() {
  Dep.target = null;
}

const reactiveMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].map(method => {
  const original = Array.prototype[method];
  return [method, function (...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted = [];

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }

    if (inserted.length) {
      observeArray(inserted)
    }

    ob.dep.notify();
    return result
  }]
})

export function observe(obj) {
  if (typeof obj !== 'object' || obj.__ob__) return;

  const dep = new Dep();
  const observer = {
    dep
  };
  def(obj, '__ob__', observer, false);

  if (Array.isArray(obj)) {
    // 下面可以替换为arr.__proto__ = reactiveMethods，但标准中已经不推荐使用了
    reactiveMethods.forEach(method => {
      def(obj, method[0], method[1], false);
    })
  } else {
    Object.entries(obj).forEach(([key, val]) => {
      defineReactive(obj, key, val)
    })
  }

  return observer;
}


export function defineReactive(obj, key, val) {
  let value = val;
  const dep = new Dep();

  const childOb = observe(val);

  Object.defineProperty(obj, key, {
    get() {
      dep.depend();
      if (childOb) {
        childOb.dep.depend();
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set(newVal) {
      value = newVal;
      observe(newVal);
      dep.notify();
    }
  });

}

export function observeArray(arr) {
  arr.forEach((item, index) => {
    defineReactive(arr, index, item)
  });
}

//
export function dependArray(arr) {
  arr.forEach(item => {
    if (item.__ob__) {
      item.__ob__.dep.depend();
    }
    if (Array.isArray(item)) {
      dependArray(item)
    }
  })
}
