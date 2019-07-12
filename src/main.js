// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import Vuetify from 'vuetify';
import App from './App';

import i18n from './libraries/i18n';
import store from './libraries/store';
import router from './libraries/router';
import plugins from './libraries/plugins';

import '../node_modules/vuetify/dist/vuetify.min.css';
import '../node_modules/nprogress/nprogress.css';
import './assets/styles/main.scss';

window.Event = new Vue();

// ## Use plugins
// =========================
Vue.use(Vuetify);
Vue.use(plugins);
sync(store, router, { moduleName: 'route' });

// ## Config
// =========================
Vue.config.debug = process.env.DEBUG_MODE;
Vue.config.silent = !process.env.DEBUG_MODE;
Vue.config.devtools = true;
Vue.config.productionTip = false;

const app = new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
});

app.$mount('#app');
