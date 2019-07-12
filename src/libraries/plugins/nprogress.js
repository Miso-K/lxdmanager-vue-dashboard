/**
 * nProgress plugin
 */
import nProgress from 'nprogress';
import router from '../router';

export default (Vue) => {
  router.beforeEach((to, from, next) => {
    nProgress.start();
    return next();
  });

  router.afterEach(() => {
    nProgress.done();
  });

  // mount the authorize to Vue component instance
  Object.defineProperties(Vue.prototype, {
    $nprogress: {
      get: () => null
    }
  });
};
