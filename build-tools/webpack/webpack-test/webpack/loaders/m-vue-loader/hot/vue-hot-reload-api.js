const map = new Map();

module.exports = {
  createRecord(options) {
    const ctor = {
      instances: [],
    }
    map.set(options, ctor)
    options.beforeCreate = function () {
      ctor.instances.push(this)
    }
  },
  rerender(options, render, staticRenderFns) {
    options.render = render;
    options.staticRenderFns = staticRenderFns;
    const ctor = map.get(options)
    ctor.instances.forEach(instance => {
      instance.$forceUpdate()
    })
  }
}
