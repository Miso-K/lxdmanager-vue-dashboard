import { AppConfigService } from '../../services';
import storage from '../../utils/storage';

export const APPCONFIG_REQUEST = 'APPCONFIG_REQUEST';
export const APPCONFIG_SUCCESS = 'APPCONFIG_SUCCESS';
export const APPCONFIG_FAILURE = 'APPCONFIG_FAILURE';

export const APPCONFIG_KEY = 'APPCONFIG';
const storedAppConfig = storage.get(APPCONFIG_KEY);

/**
 * Initial state
 * @type {Object}
 */
const appconfigState = {
  loading: false,
  appconfig: storedAppConfig || {}
};

/**
 * Getters
 * @type {Object}
 */
const appconfigGetters = {
  appconfig: state => state.appconfig // eslint-disable-line no-confusing-arrow, max-len
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [APPCONFIG_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [APPCONFIG_SUCCESS]: (state, appconfig) => {
    Object.assign(state, { ...appconfig, loading: false });
    storage.set(APPCONFIG_KEY, appconfig.appconfig);
  },
  [APPCONFIG_FAILURE]: (state, err) => {
    console.log(APPCONFIG_FAILURE, err);
    Object.assign(state, { loading: false });
    storage.remove(APPCONFIG_KEY);
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchAppConfig({ commit }) {
    commit(APPCONFIG_REQUEST);

    return AppConfigService.get()
      .then((res) => {
        commit(APPCONFIG_SUCCESS, { appconfig: res.data.data }); // it is named lxdconfig in backend
      }).catch((err) => {
        commit(APPCONFIG_FAILURE, err);
      });
  },

  saveAppConfig({ commit }, data) {
    commit(APPCONFIG_REQUEST);
    console.log(data);
    // const obj = {
    //  data: {
    //    type: 'users',
    //    attributes: data
    //  }
    // };
    return AppConfigService.post(data).then((res) => {
      console.log(res);
      commit(APPCONFIG_SUCCESS, res.data);
    }).catch((err) => {
      commit(APPCONFIG_FAILURE, err);
    });
  },

  saveCerts({ commit }, data) {
    commit(APPCONFIG_REQUEST);
    console.log(data);
    // const obj = {
    //  data: {
    //    type: 'users',
    //    attributes: data
    //  }
    // };
    return AppConfigService.postcerts(data).then((res) => {
      console.log(res);
      commit(APPCONFIG_SUCCESS, res.data);
    }).catch((err) => {
      commit(APPCONFIG_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: appconfigState,
  getters: appconfigGetters,
  mutations,
  actions
};
