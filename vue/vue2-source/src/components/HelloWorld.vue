<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div><button @click="changeMsg('changeMsg')">changeMsg</button></div>
    <!-- <child>
    </child> -->
    <slot name="test"/>
  </div>
</template>

<script>
// import Child from "./child";
import passSlots, { resetSharedSlots } from "../mixins/pass-slots";

export default {
  name: "HelloWorld",
  mixins: [passSlots],
  // components: {
  //   Child,
  // },
  props: {
    msg: String,
    testarr: String,
  },
  data() {
    return {
      // msg: "",
    };
  },
  watch: {
    msg(val) {
      console.log(val);
    },
  },
  computed: {
    twoMsg() {
      return this.msg + this.msg;
    },
  },
  beforeCreate() {
    resetSharedSlots();
  },
  mounted() {
    console.log(this.$attrs)
    window.helloTest = this;
    // this.$nextTick(() => {
    //   this.msg = "new msg!";
    //   console.log(this.twoMsg);
    // });
  },
  methods: {
    changeMsg(str) {
      this.msg = str;
    },
  },
  render(h) {
    return h(
      'h1',
      {},
      'test'
    )
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
