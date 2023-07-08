let uid = 0

export default class Dep {
  constructor() {
    this.id = uid++;
    // 用来存放 Watcher 对象的数组
    this.subs = [];
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    this.subs.forEach(sub => sub.update());
  }

  addSub(sub) {
    this.subs.push(sub);
  }
}

Dep.target = null
const targetStack = []

export function pushTarget(target) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
