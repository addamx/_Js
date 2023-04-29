// @ts-check

import { callHook, mountComponent } from "./lifecycle";
import { createElement } from "./platform/web/runtime/node-ops";
import { initRender } from "./render";
import { initState } from "./state";


let uid = 0

// ore/instance/index.ts
class Vue {
  $options = {
    components: {},
    directives: {},
    _base: Vue
  };
  $el;
  _vnode ;

  constructor(options) {
    this._init(options)
  }

  // core/instance/init.ts#initMixin
  _init(options) {
    const vm = this;

    vm._uid = uid++
    vm.$options = {
      ...this.$options,
      ...options
    };
    if (options && options._isComponent) {
      initInternalComponent(vm, options)
    }
    // initLifecycle(vm);
    // initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    // initInjections(vm);
    initState(vm);

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  $mount(el) {
    if (typeof el === 'string') {
      el = document.querySelector(el)
    }
    return mountComponent(this, el);
  }

  /**
   * @returns {import('./vdom/vnode').default}
   */
  _render() {
    const vm = this;
    const { render, _parentVnode } = vm.$options
    // vm.$createElement 在render.js#initRender中定义了
    // @ts-ignore
    const vnode = render.call(vm, vm.$createElement);
    vnode.parent = _parentVnode;
    return vnode;
  }

  _update(vnode) {
    const vm = this;
    const prevVnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevVnode) {
      vm.$el = vm.__patch__(vm.$el, vnode)
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
  }


  __patch__(oldVnode, vnode) {

    function createComponent(vnode) {
      const data = vnode.data;
      if (data?.hook?.init) {
        data.hook.init(vnode);
        if (vnode.componentInstance) {
          initComponent(vnode);
          return true
        }
      }
    }

    function initComponent(vnode) {
      vnode.elm = vnode.componentInstance.$el
    }

    function createChildren(vnode, children) {
      children.forEach(child => {
        createElm(child, vnode.elm)
      })
    }

    function insert(parent, elm) {
      if (!parent) return;
      parent.appendChild(elm)
    }

    function createElm(vnode, parentElm) {
      if (createComponent(vnode)) {
        return
      }

      const data = vnode.data;
      const children = vnode.children ?? []
      const tag = vnode.tag

      if (tag) {
        vnode.elm = document.createElement(tag);
      } else {
        vnode.elm = document.createTextNode(vnode.text);
      }
      createChildren(vnode, children);
      if (data) {
        const { attrs, on } = data;
        if (attrs) {
          for (const key in attrs) {
            vnode.elm.setAttribute(key, attrs[key]);
          }
        }
        if (on) {
          for (const key in on) {
            vnode.elm.addEventListener(key, on[key]);
          }
        }
      }
      parentElm && insert(parentElm, vnode.elm)
    }

    if (oldVnode) {
      let oldElm = oldVnode.elm || oldVnode;
      const parentElm = oldElm.parentElement;
      oldElm.parentElement.removeChild(oldElm);
      createElm(vnode)
      parentElm.appendChild(vnode.elm);
    } else {
      createElm(vnode)
    }
    return vnode.elm;
  }
}

function initInternalComponent(vm, options) {
  const opts = vm.$options = Object.create(vm.constructor.options);
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  if (options.render) {
    opts.render = options.render
  }
}



// ore/instance/lifecycle.ts
function initLifecycle(vm) {
  let parent = vm.$options.parent;
  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm;
  vm.$children = [];
}

// core/instance/events.ts
function initEvents(vm) {
  //
}



// core/global-api/index.ts
function initGlobalAPI(Vue) {
  Vue.extend = function (extendOptions) {
    const Super = this;
    const Sub = function VueComponent(options) {
      // @ts-ignore
      this._init(options)
    }
    Sub.super = Super;
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = extendOptions;
    Sub.extend = Super.extend
    return Sub;
  }
}


initGlobalAPI(Vue)
export default Vue;
