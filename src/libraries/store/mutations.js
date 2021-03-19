import { axios, storage } from '../utils';

/**
 *
 * @param  {Object} state   Vuex
 * @param  {Object} session
 */
export const CHANGE_SESSION = (state, session) => {
  if (session && session.token) {
    // change axios authorization header
    axios.defaults.headers.Authorization = `Bearer ${session.token}`;
  }
  // TODO: new session mixin
  Object.assign(state.session, session);
  storage.set('SESSION_TOKEN_KEY', state.session);
};

/**
 *
 * @param  {Object} state Vuex
 */
export const TOGGLE_SIDEBAR_COLLAPSE = (state) => {
  state.sidebar.collapse = !state.sidebar.collapse; // eslint-disable-line no-param-reassign
  storage.set('wedn_net_sidebar_collapse', state.sidebar.collapse);
};

export const CLOSE_DIALOG = (state) => {
  state.dialog = { // eslint-disable-line no-param-reassign
    active: false,
    containerId: null,
    instanceId: null
  };
};

export const OPEN_DIALOG = (state, id) => {
  state.dialog = { // eslint-disable-line no-param-reassign
    active: true,
    instanceId: id
  };
};

/**
 *
 * @param  {Object} state Vuex
 */
export const APP_LOAD = (state) => {
  state.initialized = true; // eslint-disable-line no-param-reassign
};
