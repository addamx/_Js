<template>
  <div id="app">
    <nav>
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->

      <home-view />
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import HomeView from "./views/HomeView.vue"; // @ is an alias to /src

export default Vue.extend({
  name: "App",
  components: {
    HomeView,
  },
  props: {
    title: String,
    message: {
      type: String,
      default: "Hello World!",
    },
    type: {
      type: String as PropType<"max" | "min">,
      default: "info",
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
