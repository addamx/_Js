
/*----------------------------------*/

import { observe } from "./observe";
import { watch } from "./watch";

const data = {
  text: 'Hello World',
  obj1: {
    num1: 1
  },
  arr1: [1, 2, 3]
}

observe(data);

watch(() => data.obj1.num1, (newVal, oldVal) => {
  console.log('data.obj1.num1 changed:', newVal, oldVal)
})

window.data = data;
