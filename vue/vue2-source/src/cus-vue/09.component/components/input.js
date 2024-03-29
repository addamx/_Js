export default {
  props: {
    value: {
      type: String,
      default: ''
    },
  },
  render(h) {
    return h('input', {
      attrs: {
        value: this.value
      },
      on: {
        input(ev) {
          this.$emit('input', ev.target.value)
        }
      }
    })
  }
}
