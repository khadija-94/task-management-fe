import Vue from 'vue'
import App from './App.vue'
import '@/assets/app.scss'
import './plugins'
import store from './store'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEye, faTrash, faUndo)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
