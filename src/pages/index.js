import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import element from 'element-ui'
import App from './App'

Vue.use(Vuex)
Vue.use(element)

export default new Vue({
    el: '#app',
    template: '<App/>',
    components: {App},
})