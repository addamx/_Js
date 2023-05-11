import { observe } from "./observe";
import { patch } from "./patch";
import { hoistProperty } from "./utils";
import { watch } from "./watch";

export default class Vue {
  $el;
  $options;
  _data = {};
  _vnode;

  constructor(options) {
    this._init(options);
  }

  _init(options) {
    this.$options = {
      ...options,
    }

    this.initData();
    this.initComputed();
    this.initWatch();
    this.initMethods();
  }

  initData() {
    const { data } = this.$options;
    if (!data) return;
    this._data = data;
    observe(data);
    hoistProperty(this, '_data');
  }

  initComputed() {
    const { computed } = this.$options;
    if (!computed) return;
    Object.entries(computed).forEach(([key, getter]) => {
      Object.defineProperty(this, key, {
        get: getter,
      })
    })
  }

  initWatch() {
    const { watch: watchOptions } = this.$options;
    if (!watchOptions) return;
    Object.entries(watchOptions).forEach(([key, handler]) => {
      watch.call(this, key, handler.bind(this))
    })
  }

  initMethods() {
    const { methods } = this.$options;
    if (!methods) return;
    this._methods = Object.entries(methods).reduce((acc, [key, handler]) => {
      acc[key] = (...args) => handler.call(this, ...args);
      return acc;
    }, {});
    hoistProperty(this, '_methods');
  }

  render() {
    const { render } = this.$options;
    const vnode = render.call(this, createVnode);
    return vnode;
  }

  $mount(el) {
    if (typeof el === 'string') {
      el = document.querySelector(el)
    }
    watch(() => {
      const oldVnode = this._vnode;
      const oldEl = this.$el;
      const vnode = this.render();
      this._vnode = vnode;

      this.$el = vnode.el = patch(oldVnode, vnode);
      if (oldEl !== this.$el) {
        document.body.replaceChild(this.$el, oldEl ?? el)
      }

      this.callHook('mounted');
    }, () => null)
  }

  callHook(hook) {
    const { [hook]: handler } = this.$options;
    if (handler) {
      handler.call(this);
    }
  }
}

function createVnode(tag, data, children) {
  return {
    tag,
    data,
    children,
    el: null
  }
}



