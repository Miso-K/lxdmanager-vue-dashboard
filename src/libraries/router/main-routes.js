export default [
  // - Dashboard
  {
    name: 'dashboard',
    path: '',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Dashboard')), 'dashboard')
  },
  // - Containers
  {
    name: 'servers',
    path: '/servers',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Servers')), 'servers')
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
    meta: { auth: 'me_edit' },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Settings')), 'settings')
  },
  // - Settings
  {
    name: 'machine',
    path: '/machine/:id',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Machine')), 'machine')
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
    meta: { auth: 'lxd_config' },
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
