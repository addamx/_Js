import Vue from "./vue";

new Vue({
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
    window.vueRoot = this;
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
}).$mount('#app')
