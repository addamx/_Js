// init Vue
import Vue from "vue";
import VueRouter from "vue-router";
import router from "./router/index";

console.log('init-vue')

Vue.use(VueRouter)

const vueApp = new Vue({
  router: router,
  render: h => h('div', 'loading...')
}).$mount("#app");

setTimeout(() => {
  import("./init-app").then(({default: init}) => {
    init(vueApp);
  })
},1000)
