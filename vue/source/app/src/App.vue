<template>
  <div id="app">
    <img
      alt="Vue logo"
      src="./assets/logo.png"
    >
    <HelloWorld msg="Welcome to Your Vue.js App">
      <template slot="test">
        <v-text :text="test" />
      </template>
    </HelloWorld>

    <span>c:{{c}}</span>
    <span>b: {{b}}</span>
    <p>{{renderD()}}</p>
    <button @click="a = a + 1">a+</button>
    <button @click="b = b + 1">b+</button>

  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import VText from "./components/text";

export default {
  name: "App",
  components: {
    HelloWorld,
    VText,
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
      console.log(111)
      return this.a + 1;
    }
  },
  mounted() {
    window.appTest = this;
  },
  methods: {
    renderD() {
      console.log('renderD')
      return 'dfd';
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
