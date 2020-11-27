import _map from 'lodash/map';
import { ProfilesService } from '../../services';

export const PROFILES_REQUEST = 'PROFILES_REQUEST';
export const PROFILES_SUCCESS = 'PROFILES_SUCCESS';
export const PROFILES_FAILURE = 'PROFILES_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const profilesState = {
  loading: false,
  profiles: {}
};

/**
 * Getters
 * @type {Object}
 */
const profilesGetters = {
  profiles: state => state.profiles, // eslint-disable-line no-confusing-arrow, max-len
  profilesTableData(state, getters) {
    if (Object.keys(getters.profiles).length === 0) return false;
    return _map(getters.profiles, profile => profile); // eslint-disable-line max-len
  }
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [PROFILES_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [PROFILES_SUCCESS]: (state, profiles) => {
    Object.assign(state, { ...profiles, loading: false });
  },
  [PROFILES_FAILURE]: (state, err) => {
    console.log(PROFILES_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchProfiles({ commit }) {
    commit(PROFILES_REQUEST);

    return ProfilesService.get()
      .then((res) => {
        // console.log(res);
        commit(PROFILES_SUCCESS, { profiles: res.data.data });
      }).catch((err) => {
        commit(PROFILES_FAILURE, err);
      });
  },

  createProfile({ commit }, data) {
    commit(PROFILES_REQUEST);
    const obj = data;
    // console.log(obj);
    return ProfilesService.post(data.server, obj).then((res) => {
      // console.log(res);
      commit(PROFILES_SUCCESS, res.data);
    }).catch((err) => {
      commit(PROFILES_FAILURE, err);
    });
  },

  updateProfile({ commit }, data) {
    commit(PROFILES_REQUEST);
    const obj = data;
    const name = data.data.name;
    return ProfilesService.put(data.server, name, obj).then((res) => {
      // console.log(res);
      commit(PROFILES_SUCCESS, res.data);
    }).catch((err) => {
      commit(PROFILES_FAILURE, err);
    });
  },

  deleteProfile({ commit }, data) {
    commit(PROFILES_REQUEST);
    return ProfilesService.delete(data.server, data.name).then((res) => {
      commit(PROFILES_SUCCESS, res.data);
    }).catch((err) => {
      commit(PROFILES_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: profilesState,
  getters: profilesGetters,
  mutations,
  actions
};
