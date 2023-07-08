// init app， vuex
import Vue from "vue";
import Vuex from 'vuex'
import AppDev from './AppDev.vue';

console.log('init-app, vuex')

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
})

Vue.mixin({
  beforeCreate() {
    this.$store = store
  }
})

export default vueApp => {
  vueApp.$options.render = h => h(AppDev);
  vueApp.$forceUpdate();
}

