import Vue from "./vue";

window.vueRoot = new Vue({
  data: {
    num: 1,
    text: 'Hello World',
  },
  computed: {
    computedText() {
      return `computed_${this.text}`
    }
  },
  watch: {
    text(newVal, oldVal) {
      this.log('text changed:', newVal, oldVal)
    },
    computedText(newVal, oldVal) {
      this.log('computedText changed:', newVal, oldVal)
    }
  },
  mounted() {
    this.log('mounted');
  },
  methods: {
    log(...args) {
      console.log(...args)
    },
    addNum() {
      this.num++;
    }
  },
  render(h) {
    const { num, computedText } = this

    return h('div', {}, [
      h('h1', {
        style: {
          color: num > 3 ? 'red' : 'green',
        },
      }, computedText),

      // h('p', {}, [
      //   h('input', {
      //     attrs: {
      //       id: 'input1',
      //       value: this.text
      //     },
      //     on: {
      //       input: (e) => {
      //         this.text = e.target.value
      //       }
      //     }
      //   })
      // ]),

      `num: ${num}`,
      h('p', {}, [
        h('button', {
        on: {
          click: this.addNum
        },
      }, 'add num'),
      h('button', {
        on: {
          click: () => this.num--
        },
      }, 'decrease num')
      ]),
    ])
  }
})

window.vueRoot.$mount('#app')


