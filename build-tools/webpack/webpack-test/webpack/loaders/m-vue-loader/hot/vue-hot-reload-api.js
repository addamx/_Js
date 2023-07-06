const map = new Map();

module.exports = {
  createRecord(id, options) {
    const record = {
      Ctor: null,
      options,
      instances: [],
    }
    map.set(id, record);
    this.makeOptionsHot(id, options)
  },
  makeOptionsHot(id, options) {
    options.beforeCreate = function () {
      const record = map.get(id)
      record.instances.push(this)
      record.Ctor = this.constructor;
      console.log('-----------beforeCreate')
    }
    options.beforeDestroy = function () {
      const record = map.get(id)
      const instances = record.instances
      instances.splice(instances.indexOf(this), 1)
      console.log('-----------beforeDestroy')
    }
  },
  isRecorded(id) {
    return map.has(id);
  },
  reload(id, options) {
    const record = map.get(id);
    this.makeOptionsHot(id, options);
    if (record.Ctor) {
      const newCtor = record.Ctor.super.extend(options)
      // newCtor.options._Ctor = record.options._Ctor;
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid; // 刷新 vNode的tag ("vue-component-" + (Ctor.cid)）以便让vue认为vnode是新的,
      record.Ctor.prototype = newCtor.prototype
    }
    record.instances.forEach(instance => {
      instance.$vnode.context.$forceUpdate();
    })
  },
  rerender(id, options, {
    render, staticRenderFns
  }) {
    const record = map.get(id)
    record.Ctor.options.render = render;
    // record.Ctor.options.staticRenderFns = staticRenderFns;

    record.instances.forEach(instance => {
      instance.$options.render = render;
      // instance.$options.staticRenderFns = options.staticRenderFns
      instance.$forceUpdate()
    })
  }
}
