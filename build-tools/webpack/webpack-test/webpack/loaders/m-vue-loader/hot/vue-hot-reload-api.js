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
    optoins.render = render;
    optoins.staticRenderFns = staticRenderFns;
    const ctor = map.get(options)
    ctor.instances.forEach(instance => {
      instance.$forceUpdate()
    })
  }
}
