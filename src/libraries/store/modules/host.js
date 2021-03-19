import { HostService } from '../../services';

export const HOST_REQUEST = 'HOST_REQUEST';
export const HOST_SUCCESS = 'HOST_SUCCESS';
export const HOST_FAILURE = 'HOST_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const hostState = {
  loading: false,
  host: {}
};

/**
 * Getters
 * @type {Object}
 */
const hostGetters = {
  host: state => state.host // eslint-disable-line no-confusing-arrow, max-len
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [HOST_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [HOST_SUCCESS]: (state, host) => {
    Object.assign(state, { ...host, loading: false });
  },
  [HOST_FAILURE]: (state, err) => {
    console.log(HOST_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchHost({ commit }) {
    commit(HOST_REQUEST);

    return HostService.get()
      .then((res) => {
        // console.log(res);
        commit(HOST_SUCCESS, { host: res.data.data });
      }).catch((err) => {
        commit(HOST_FAILURE, err);
      });
  }
};

// Export module
export default {
  state: hostState,
  getters: hostGetters,
  mutations,
  actions
};
