import 'babel-polyfill';
import Vue from 'vue';
import Router from 'vue-router';
import routes from './router/router';
import resource from 'vue-resource';

Vue.use(Router)
Vue.use(resource)

const router = new Router({
    routes, // （缩写）相当于 routes: routes
    //在非strict时, 会自动在url结尾加'/'或其他自定义delimiter
	strict: process.env.NODE_ENV !== 'production'
})

new Vue({
    router
}).$mount('#app')
