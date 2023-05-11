import { observe } from "./observe";
import { hoistProperty } from "./utils";
import { watch } from "./watch";

export default class Vue {
  $el;
  $options;
  _data = {};

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
    const dom = render.call(this, createElement);
    return dom;
  }

  $mount(el) {
    if (typeof el === 'string') {
      el = document.querySelector(el)
    }
    watch(() => {
      const dom = this.render();
      this.$el = dom;
      el.innerHTML = '';
      el.appendChild(dom);

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


function createElement(tag, data, children) {
  const dom = document.createElement(tag)
  if (data) {
    const { style = {},  attrs = {}, on = {} } = data;
    let classNames = data.class;

    Object.entries(style).forEach(([key, val]) => {
      dom.style[key] = val;
    })
    Object.entries(attrs).forEach(([key, val]) => {
      dom.setAttribute(key, val)
    })
    if (classNames) {
      if (typeof classNames === 'string') {
        classNames = [classNames]
      } else if (!Array.isArray(classNames)) {
        classNames = Object.entries(classNames).reduce((acc, [key, val]) => {
          if (val) {
            acc.push(key)
          }
          return acc;
        }, [])
      }
      dom.classList.add(...classNames);
    }
    Object.entries(on).forEach(([key, val]) => {
      dom.addEventListener(key, (ev) => val(ev))
    })
  }
  if (children) {
    if (!Array.isArray(children)) {
      children = [children]
    }
    children.forEach(child => {
      if (typeof child === 'string') {
        child = document.createTextNode(child)
      }
      dom.appendChild(child)
    })
  }
  return dom;
}

