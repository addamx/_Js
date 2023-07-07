const map = new Map();

module.exports = {
  createRecord(id, options) {
    if (map.has(id)) {
      return;
    }
    const record = {
      Ctor: null,
      instances: [],
    };
    map.set(id, record);
    this.makeOptionsHot(id, options);
  },
  makeOptionsHot(id, options) {
    injectHook(options, 'beforeCreate', function () {
      const record = map.get(id);
      record.instances.push(this);
      // 只记录第一个实例的构造函数
      if (!record.Ctor) {
        record.Ctor = this.constructor;
      }
    });
    injectHook(options, 'beforeDestroy', function () {
      const record = map.get(id);
      const instances = record.instances;
      instances.splice(instances.indexOf(this), 1);
    });
  },
  isRecorded(id) {
    return map.has(id);
  },
  reload(id, options) {
    const record = map.get(id);
    this.makeOptionsHot(id, options);
    if (record.Ctor) {
      const newCtor = record.Ctor.super.extend(options); // 构造临时的新构建函数(newCtor)，但只为了更新ctor的 options/cid/prototype
      record.Ctor.options = newCtor.options;
      record.Ctor.cid = newCtor.cid; // 刷新 vNode的tag ("vue-component-" + (Ctor.cid)）以便让vue在patch认为vnode是组件构造函数被替换（<a> 替换成 <b>）
      record.Ctor.prototype = newCtor.prototype;
    }
    record.instances.forEach((instance) => {
      instance.$vnode.context.$forceUpdate();
    });
  },
  rerender(id, options, { render, staticRenderFns }) {
    const record = map.get(id);
    record.Ctor.options.render = render;
    // record.Ctor.options.staticRenderFns = staticRenderFns;

    record.instances.forEach((instance) => {
      instance.$options.render = render;
      // instance.$options.staticRenderFns = options.staticRenderFns
      instance.$forceUpdate();
    });
  },
};

function injectHook(options, name, hook) {
  var existing = options[name];
  options[name] = existing
    ? Array.isArray(existing)
      ? existing.concat(hook)
      : [existing, hook]
    : [hook];
}
