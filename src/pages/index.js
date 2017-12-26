import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import element from 'element-ui'
import App from './App'
import store from '../store/'

Vue.use(Vuex)
Vue.use(element)

export default new Vue({
    el: '#app',
    template: '<App/>',
    components: {App},
    store,
})