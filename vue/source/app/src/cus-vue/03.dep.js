class Dep {
  static target;
  watchers;

  constructor() {
    this.watchers = new Set();
  }

  depend() {
    if (Dep.target) {
      this.watchers.add(Dep.target)
    }
  }

  notify() {
    this.watchers.forEach(watcher => watcher())
  }
}

function defineReactive(data, key,) {
  let value = data[key];
  const dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      dep.depend();
      return value
    },
    set(newVal) {
      value = newVal;
      dep.notify();
    }
  })
}

function observe(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(data, key)
  })
}

/*----------------------------------*/

const data = {
  text: 'Hello World',
}

observe(data);

function consoleWhenTextChange() {
  // read data.text
  console.log('text change', data.text);
}
Dep.target = consoleWhenTextChange;
consoleWhenTextChange();
Dep.target = null

function render() {
  // data.text
  const elm = document.createElement('h1');
  elm.textContent = data.text

  const rootElm = document.getElementById('app');
  rootElm.innerHTML = '';
  rootElm.appendChild(elm);
}
Dep.target = render;
render();
Dep.target = null;

window.data = data;
