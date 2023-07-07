// import pluginA from './plugin-a';
// import './css/app.css'
import App from './app.vue'
import Vue from 'vue'

console.log('App.vue', App);
window.AppVue = App;

// console.log(pluginA.name)
// console.log('main console!')

new Vue({
  render: h => h(App)
}).$mount('#app')
