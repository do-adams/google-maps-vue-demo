import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueCompositionAPI)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
