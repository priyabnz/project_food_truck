import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
 import Multiselect from 'vue-multiselect'

// Vue.use(VueLodash)
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
 Vue.component('multiselect', Multiselect)
 Vue.use(VueAxios,axios)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
