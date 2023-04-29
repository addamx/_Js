import Vue from './mini-vue/index.js'
import App from './App.vue'

window.Vue = Vue;

new Vue({
  render: h => h(App),
}).$mount('#app')
