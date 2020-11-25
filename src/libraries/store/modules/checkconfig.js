import { CheckconfigService } from '../../services';

export const CHECKCONFIG_REQUEST = 'CHECKCONFIG_REQUEST';
export const CHECKCONFIG_SUCCESS = 'CHECKCONFIG_SUCCESS';
export const CHECKCONFIG_FAILURE = 'CHECKCONFIG_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const checkconfigState = {
  checkconfig: {},
  loading: false
};

/**
 * Getters
 * @type {Object}
 */
const checkconfigGetters = {
  checkconfig: state => state.checkconfig
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [CHECKCONFIG_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [CHECKCONFIG_SUCCESS]: (state, host) => {
    Object.assign(state, { ...host, loading: false });
  },
  [CHECKCONFIG_FAILURE]: (state, err) => {
    console.log(CHECKCONFIG_FAILURE, err);
    Object.assign(state, { checkconfig: '', loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchCheckconfig({ commit }, data) {
    commit(CHECKCONFIG_REQUEST);
    console.log(data);
    return CheckconfigService.get(data)
      .then((res) => {
        console.log(res);
        commit(CHECKCONFIG_SUCCESS, { checkconfig: res.data.data });
      }).catch((err) => {
        commit(CHECKCONFIG_FAILURE, err);
      });
  }
};

// Export module
export default {
  state: checkconfigState,
  getters: checkconfigGetters,
  mutations,
  actions
};
