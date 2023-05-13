import { observe } from "./observe";
import { patch } from "./patch";
import { hoistProperty } from "./utils";
import { createVnode } from "./vnode";
import { watch } from "./watch";

export default class Vue {
  $el;
  $options;
  _data = {};
  components = {}
  _vnode;

  constructor(options) {
    this._init(options);
  }

  _init(options) {
    this.$options = {
      ...options,
    }

    this.components = options.components ?? {};

    this.initEvents();
    this.initProps();
    this.initData();
    this.initComputed();
    this.initWatch();
    this.initMethods();
  }

  initEvents() {
    const { on = {} } = this.$options;
    this._events = {};
    Object.entries(on).forEach(([key, handler]) => {
      this._events[key] = (...args) => handler.call(this, ...args);
    });
  }

  $emit(event, ...args) {
    const { [event]: handler } = this._events;
    if (handler) {
      handler(...args);
    }
  }

  initProps() {
    const { propsData = {}, props = {} } = this.$options;
    this._props = {};
    Object.entries(props).forEach(([key, { type, default: defaultVal }]) => {
      const propsValue = propsData[key];
      if (type && typeof propsValue !== type) {
        console.warn(`props ${key} should be ${type}`)
      }
      this._props[key] = propsData[key] ?? defaultVal;
    });
    hoistProperty(this, '_props');
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
    const vnode = render.call(this, createVnode.bind(this));
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

      if (el && oldEl !== this.$el) {
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





