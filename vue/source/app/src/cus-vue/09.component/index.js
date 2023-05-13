import Vue from "./vue";
import Text from './components/text'
import Input from './components/input'

new Vue({
  components: {
    Input
  },
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
    const { num, computedText } = this

    return h('div', {}, [
      h('h1', {
        style: {
          color: num > 3 ? 'red' : 'green',
        },
      }, computedText),

      h('p', {}, [
        h(Input, {
          props: {
            value: this.text
          },
          on: {
            input: (val) => {
              this.text = val
            }
          }
        })
      ]),

      h('p', {}, [h(Text, {
        props: {
          text: this.text,
          size: 24
        }
      })])
    ])
  }
}).$mount('#app')
