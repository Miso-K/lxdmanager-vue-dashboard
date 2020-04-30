export default [
  // - Dashboard
  {
    name: 'dashboard',
    path: '/',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Dashboard')), 'dashboard')
  },
  // - Containers
  {
    name: 'containers',
    path: '/containers',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Containers')), 'containers')
  },
  // - Containers
  {
    name: 'images',
    path: '/images',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Images')), 'images')
  },
  // - Users
  {
    name: 'users',
    path: '/users',
    meta: { auth: 'users_create' },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Users')), 'users')
  },
  // - Groups
  {
    name: 'groups',
    path: '/groups',
    meta: { auth: 'groups_create' },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Groups')), 'groups')
  },
  // - Settings
  {
    name: 'settings',
    path: '/settings',
    meta: { auth: 'me_update' },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Settings')), 'settings')
  },
  // - Settings
  {
    name: 'container',
    path: '/container/:id',
    meta: { auth: true },
    props: true,
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Container')), 'container')
  },
  // - Help
  {
    name: 'help',
    path: '/help',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Help')), 'help')
  },
  // - Appconfig
  {
    name: 'appconfig',
    path: '/appconfig',
    meta: { auth: 'config_infos' },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/AppConfig')), 'appconfig')
  },
  // - Requests
  {
    name: 'requests',
    path: '/requests',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Requests')), 'help')
  }
];
