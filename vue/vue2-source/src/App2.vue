<script lang="jsx">
import JsxChild from './components/jsx-child'
export default {
  components: {
    JsxChild
  },
  render() {
    return <div>
      <JsxChild {...{
        scopedSlots: {
          top: () => <h2>scopedSlots top</h2>
        }
      }
    } >
    <h2 slot="do">scopedSlots top</h2>
    </JsxChild>
    </div>
  }
}
</script>

<style></style>
