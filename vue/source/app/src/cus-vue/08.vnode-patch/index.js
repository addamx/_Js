import Vue from "./vue";

window.vueRoot = new Vue({
  data: {
    num: 1,
    text: 'Hello World',
    list: []
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
    window.vueRoot = this;
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
    const { num, computedText, list } = this

    return h('div', {}, [
      h('h1', {
        style: {
          color: num > 3 ? 'red' : 'green',
        },
      }, computedText),

      h('p', {}, [
        h('input', {
          attrs: {
            id: 'input1',
            value: this.text
          },
          on: {
            input: (e) => {
              this.text = e.target.value
            }
          }
        })
      ]),

      h('p', {},
        list.map(text => h('div', {
          style: {
          border: '1px solid red',
        }
      }, text))
      )
    ])
  }
})

window.vueRoot.$mount('#app')


