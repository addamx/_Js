const map = new Map();

module.exports = {
  createRecord(options) {
    const record = {
      Ctor: null,
      instances: [],
    }
    map.set(options, record)
    options.beforeCreate = function () {
      record.instances.push(this)
      record.Ctor = this.constructor;
    }
  },
  isRecorded(options) {
    return map.has(options);
  },
  reload(options) {
    const record = map.get(options)
    if (record.Ctor) {
      const newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.prototype = newCtor.prototype
    }
  },
  rerender(options, {
    render, staticRenderFns
  }) {
    const record = map.get(options)
    record.Ctor.options.render = render;
    // record.Ctor.options.staticRenderFns = staticRenderFns;

    record.instances.forEach(instance => {
      instance.$options.render = render;
      // instance.$options.staticRenderFns = options.staticRenderFns
      instance.$forceUpdate()
    })
  }
}
