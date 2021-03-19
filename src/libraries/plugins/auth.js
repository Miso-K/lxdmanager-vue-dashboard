/**
 * Auth middleware
 */
import _intersection from 'lodash/intersection';
import store from '../store';
import router from '../router';

export const checkAbilities = (required, abilities) => {
  if (required.length > 0) {
    if (typeof required === 'string') {
      return abilities.indexOf(required) !== -1;
    }

    if (required instanceof Array) {
      return _intersection(abilities, required).length === required.length;
    }
  }

  return false;
};

export const loadAndCheckAuth = auth => store.dispatch('load')
  .then(() => {
    if (auth !== false && auth !== true && !checkAbilities(auth, store.getters['auth/me'].abilities)) {
      return Promise.reject();
    }

    return Promise.resolve();
  });

export default (Vue) => {
  // Authorize
  // Make sure that is the first hook.
  router.beforeHooks.unshift((to, from, next) => { // eslint-disable-line consistent-return
    // don't need authorize
    if (!to.meta.auth) return next();

    // check login state
    store.dispatch('auth/checkToken')
      .then((valid) => { // eslint-disable-line consistent-return
        // authorized
        if (valid) return next();

        // unauthorized
        console.log('⛔️  Unauthorized');
        next({ name: 'login', query: { redirect: to.fullPath } });
      });
  });

  // Redirect to dashboard if accessing '/login' when authenticated
  router.beforeEach((to, from, next) => { // eslint-disable-line consistent-return
    if (to.name !== 'login') return next();

    store.dispatch('auth/checkToken')
      .then((valid) => { // eslint-disable-line consistent-return
        if (!valid) return next();

        // when logged in
        next({ path: to.query.redirect || '/' });
      });
  });

  // mount the authorize to Vue component instance
  Object.defineProperties(Vue.prototype, {
    $auth: {
      get: () => ({
        me() {
          return store.getters['auth/me'];
        },
        admin() {
          return this.me().admin || false;
        },
        can(abilities) {
          return checkAbilities(abilities, this.me().abilities);
        }
      })
    }
  });
};
