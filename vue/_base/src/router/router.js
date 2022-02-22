import App from '../App.vue'

const form = r => require.ensure( [], () => r(require('../components/form.vue')), 'form')

const routes = [
    { path: '/form', component: form },
]
export default [{
    path: '/',
    component: App,
    children: [
        {
            path: '/form',
            component: form,
        }
    ]
}]
