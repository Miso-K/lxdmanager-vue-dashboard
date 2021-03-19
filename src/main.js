import Vue from 'vue'
import './libraries/utils/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './libraries/router'
import store from './libraries/store/index'
import i18n from './libraries/i18n/index';
// import Vuex from './libraries/store/index'
// import Layout from './layouts/Layout.vue'

// Vue.component('Layout', Layout)

Vue.config.productionTip = false

new Vue({
  vuetify,
  i18n,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
