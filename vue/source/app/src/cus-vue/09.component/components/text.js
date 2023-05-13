export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 14
    }
  },
  render(h) {
    return h('div', {
      style: {
        fontSize: `${this.size}px`
      }
    }, this.text)
  }
}
