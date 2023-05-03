

let curWatcher = null;
function observe(data, key,) {
  let value = data[key];
  const watchers = new Set();
  Object.defineProperty(data, key, {
    get() {
      if (curWatcher) {
        watchers.add(curWatcher)
      }
      return value
    },
    set(newVal) {
      value = newVal;
      watchers.forEach(watcher => watcher())
    }
  })
}

const data = {
  text: 'Hello World',
}

observe(data, 'text')

function consoleWhenTextChange() {
  // read data.text
  console.log('text change', data.text);
}
curWatcher = consoleWhenTextChange;
consoleWhenTextChange();
curWatcher = null;

function render() {
  const elm = document.createElement('h1');
  elm.textContent = data.text

  const rootElm = document.getElementById('app');
  rootElm.innerHTML = '';
  rootElm.appendChild(elm);
}
curWatcher = render;
render();
curWatcher = null;

window.data = data;
