// @ts-check
import { popTarget, pushTarget } from "./observer/dep";
import Watcher from "./observer/watcher";

/**
 * @param {import('./index').default} vm
 * @param {HTMLElement} el
 * @returns
 */
export function mountComponent(vm, el) {
  vm.$el = el;
  callHook(vm, "beforeMount");

  const updateComponent = () => {
    vm._update(vm._render());
  };

  new Watcher(vm, updateComponent);

  callHook(vm, "mounted");

  return vm;
}


export function callHook(vm, hook, args) {
  pushTarget();

  let handlers = vm.$options[hook];
  if (handlers) {
    if (!Array.isArray(handlers)) {
      handlers = [handlers];
    }

    handlers?.forEach(handler => handler.call(vm, args));
  }

  popTarget();
}
