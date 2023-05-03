
/*----------------------------------*/

import { AddDepTarget, observe, RemoveDepTarget } from "./observe";

const data = {
  text: 'Hello World',
  obj1: {
    num1: 1
  },
  arr1: [1, 2, 3]
}

observe(data);

function render() {
  AddDepTarget(render);

  const contents = [
    `text: ${data.text}`,
    `obj1.num1: ${data.obj1.num1}`,
    `arr1: ${data.arr1.join(', ')}`,
    `arr1[0].prop1: ${data.arr1[0]?.prop1 ?? ''}`
  ];

  const rootElm = document.getElementById('app');
  rootElm.innerHTML = '';
  contents.forEach(text => {
    const elm = document.createElement('h2');
    elm.textContent = text;
    rootElm.appendChild(elm)
  })

  RemoveDepTarget()
}
render();

window.data = data;
