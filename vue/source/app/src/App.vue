<script>

export default {
  name: "App",
  data() {
    return {
      title: 'This is APP component',
      dataA: 1,
      dataB: 2
    };
  },
  computed: {
    computedC() {
      this.log('exec computedC')
      return this.dataA + this.dataB;
    },
  },
  watch: {
    dataA(val) {
      this.log('exec watch dataA')
    },
    computedC(val) {
      this.log('exec watch computedC')
    },
  },
  beforeCreate() {
    console.log('===================')
    console.log('exec beforeCreate')
  },
  created() {
    this.log('exec created')
  },
  beforeMount() {
    this.log('exec beforeMount')
  },
  mounted() {
    this.log('exec mounted')
    console.log('===================')
    window.app = this;
  },
  beforeUpdate() {
    this.log('exec beforeUpdate')
  },
  updated() {
    this.log('exec updated')
  },
  beforeDestroy() {
    this.log('exec beforeDestroy')
  },
  destroyed() {
    this.log('exec destroyed')
  },
  methods: {
    plusA() {
      this.log('exec method plusA')
      ++this.dataA;
    },
    log(...args) {
      console.log(...args)
    }
  },
  render(h) {
    this.log('exec render')

    const {title, computedC = 1} = this

    return h(
      'div',
      {
        attrs: {
          id: 'app'
        },
      },
      [
        h('span', {}, [title]),
        h(
          'div',
          {},
          [computedC]
        ),
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
