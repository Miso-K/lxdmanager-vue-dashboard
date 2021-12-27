export default [
  // - Dashboard
  {
    name: 'dashboard',
    path: '/dashboard',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Dashboard')), 'dashboard')
  },
  // - Instances
  {
    name: 'instances',
    path: '/instances',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Instances')), 'instances')
  },
  // - Images
  {
    name: 'images',
    path: '/images',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Images')), 'images')
  },
  // - Networks
  {
    name: 'networks',
    path: '/networks',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Networks')), 'networks')
  },
  // - Profiles
  {
    name: 'profiles',
    path: '/profiles',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Profiles')), 'profiles')
  },
  // - Projects
  {
    name: 'projects',
    path: '/projects',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Projects')), 'projects')
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
  // - Instance
  {
    name: 'instance',
    path: '/instance/:id',
    meta: { auth: true },
    props: true,
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Instance')), 'instance')
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
