import { createElement } from "./vdom/create-element";

export function initRender(vm) {
  vm._vnode = null;

  // const options = vm.$options
  // const parentVnode = vm.$vnode = options._parentVnode

  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // defineReactive $attrs, $listeners
}
