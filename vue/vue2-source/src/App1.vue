<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />

    <span>c:{{ c }}</span>
    <span>b: {{ b }}</span>
    <p>{{ renderD() }}</p>
    <button @click="a = a + 1">a+</button>
    <button @click="b = b + 1">b+</button>

    <transition :name="transitionName" :duration="2000">
      <keep-alive>
        <div>
          <HelloWorld v-if="a % 2 === 0" msg="偶数" testarr="aa">
            <template slot="test">
              <v-text :text="test" />
            </template>
          </HelloWorld>

          <HelloWorld v-else msg="奇数" testarr="aa">
            <template slot="test">
              <v-text :text="test" />
            </template>
          </HelloWorld>
        </div>
      </keep-alive>
    </transition>

    <!-- <transition :name="transitionName"  :duration="2000">
      <HelloWorld v-if="a%2!==0" msg="slide-right" testarr="aa">
        <template slot="test">

          <v-text :text="test" />
        </template>
      </HelloWorld>
    </transition> -->
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import VText from "./components/text";

// let i = 0;
export default {
  name: "App",
  components: {
    HelloWorld,
    VText
  },
  data() {
    return {
      test: 123123,
      a: 1,
      b: 2
    };
  },
  computed: {
    c() {
      console.log(111);
      return this.a + 1;
    },
    transitionName() {
      const res = String(this.a);
      console.log(res);
      return res;
    }
  },
  mounted() {
    window.appTest = this;
  },
  methods: {
    renderD() {
      console.log("renderD");
      return "dfd";
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
