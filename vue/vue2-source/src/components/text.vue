<script>
export default {
  props: {
    text: {
      type: [String, Number],
    }
  },
  render(h) {
    return h('div', {}, [this.text])
  }
};
</script>

<style>
</style>
