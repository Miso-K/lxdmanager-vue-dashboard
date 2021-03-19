import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

const Router = new VueRouter({
  // mode: 'history',
  mode: process.env.PUBLIC_URL ? 'history' : 'hash',
  base: process.env.PUBLIC_URL,
  routes
});

export default Router;
// https://router.vuejs.org/zh-cn/advanced/scroll-behavior.html
// https://github.com/vuejs/vue-router/blob/next/examples/scroll-behavior/app.js
