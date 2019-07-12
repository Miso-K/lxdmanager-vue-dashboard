import mainRoutes from './main-routes';
import store from '../store';

export default [
  // ## login page
  {
    name: 'login',
    path: '/login',
    meta: { auth: false },
    component: resolve => require.ensure([], () => resolve(require('../../views/layouts/Login')), 'login')
  },
  // ## login page
  {
    name: 'login-otp',
    path: '/login-otp',
    meta: { auth: false },
    component: resolve => require.ensure([], () => resolve(require('../../views/layouts/LoginOtp')), 'login-otp')
  },
  // ## logout page
  {
    name: 'logout',
    path: '/logout',
    meta: { auth: false },
    beforeEnter(to, from, next) {
      store.dispatch('auth/logout');
      next({ name: 'login', query: { logout: 1 } });
    }
  },
  // ## main page
  {
    path: '/',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/layouts/Layout')), 'common'),
    children: mainRoutes
  },
  // ## not found page
  {
    name: 'not-found',
    path: '*',
    meta: { auth: false },
    component: resolve => require.ensure([], () => resolve(require('../../views/layouts/Error')), 'common')
  }
];
