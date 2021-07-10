import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vmodal from 'vue-js-modal'
import 'vue-js-modal/dist/styles.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import VueSwal from 'vue-swal'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(vmodal)
Vue.use(VueSwal)
Vue.component('v-select', vSelect)

new Vue({
  render: h => h(App),
}).$mount('#app')
