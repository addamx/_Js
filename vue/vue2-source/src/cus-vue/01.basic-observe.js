
function observe(data, key, cb) {
  let value = data[key]
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newVal) {
      value = newVal;
      cb();
    }
  })
}

const data = {
  text: 'Hello World',
}

observe(data, 'text', () => {
  console.log('rewrite text')
})

window.data = data;
data.text = 'Hello World 2';
