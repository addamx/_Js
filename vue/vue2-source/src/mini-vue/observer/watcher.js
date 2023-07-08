import { popTarget, pushTarget } from "./dep";

export default class Watcher {
  newDepIds = new Set()

  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.getter = typeof expOrFn === 'function' ? expOrFn : () => vm[expOrFn];
    this.value = this.get();
    this.newDepIds = new Set();
    this.dirty = false;
    this.cb = cb || function () { };
  }

  get() {
    pushTarget(this);
    const value =this.getter.call(this.vm, this.vm);
    popTarget();
    return value;
  }

  addDep(dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      dep.addSub(this);
    }
  }

  update() {
    this.run();
  }

  run() {
    const value = this.get();
    if (value !== this.value) {
      const oldValue = this.value;
      this.value = value;
      this.cb.call(this.vm, value, oldValue);
    }
  }
  // evaluate() {
  //   this.value = this.get();
  // }
}
