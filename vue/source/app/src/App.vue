<script>
import Text from './components/text.vue'

export default {
  name: "App",
  data() {
    return {
      title: 'This is APP component',
      dataA: 1,
      dataB: 2,
      obj1: {a: 1, b: 2},
      arr: []
    };
  },
  computed: {
    // computedC() {
    //   console.log('exec computedC')
    //   return this.dataA + this.dataB;
    // },
  },
  watch: {
    // dataA() {
    //   console.log('exec watch dataA')
    // },
    // computedC() {
    //   console.log('exec watch computedC')
    // },
  },
  beforeCreate() {
    console.log('===================')
    console.log('exec beforeCreate')
  },
  created() {
    console.log('exec created')
  },
  beforeMount() {
    console.log('exec beforeMount')
  },
  mounted() {
    console.log('exec mounted')
    console.log('===================')
    window.app = this;
  },
  beforeUpdate() {
    console.log('exec beforeUpdate')
  },
  updated() {
    console.log('exec updated')
  },
  beforeDestroy() {
    console.log('exec beforeDestroy')
  },
  destroyed() {
    console.log('exec destroyed')
  },
  methods: {
    plusA() {
      console.log('exec method plusA')
      ++this.dataA;
    },
  },
  render(h) {
    console.log('exec render')

    const {dataA} = this
    return h(
      'div',
      {
        attrs: {
          id: 'app'
        },
      },
      [
        h(Text, {props: {text: `dataA is: ${dataA}`}},),
        // h(
        //   'div',
        //   {},
        //   [`computedC is: ${computedC}`]
        // ),
        h(
          'button',
          {
            on: {
              click: this.plusA
            },
          },
          'plusA'
        ),
      ]
    )
  }
};
</script>

<style>

</style>
