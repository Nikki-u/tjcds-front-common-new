// ie polyfill
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import Tjcds from '../packages/index'
import axios from 'axios'

Vue.use(Tjcds, { axios })
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
