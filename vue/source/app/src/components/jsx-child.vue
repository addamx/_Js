
<script lang="jsx">
export default {
  render() {
    console.log('$slots', this.$slots)
    console.log('$slotScopes', this.$scopedSlots)
    return <div>jsx-child</div>
  }
}
</script>

<style>

</style>
