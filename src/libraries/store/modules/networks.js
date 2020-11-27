import _map from 'lodash/map';
import { NetworksService } from '../../services';

export const NETWORKS_REQUEST = 'NETWORKS_REQUEST';
export const NETWORKS_SUCCESS = 'NETWORKS_SUCCESS';
export const NETWORKS_FAILURE = 'NETWORKS_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const networksState = {
  loading: false,
  networks: []
};

/**
 * Getters
 * @type {Object}
 */
const networksGetters = {
  networks: state => state.networks, // eslint-disable-line no-confusing-arrow, max-len
  networksTableData(state, getters) {
    if (Object.keys(getters.networks).length === 0) return false;
    return _map(getters.networks, network => network); // eslint-disable-line max-len
  }
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [NETWORKS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [NETWORKS_SUCCESS]: (state, networks) => {
    Object.assign(state, { ...networks, loading: false });
  },
  [NETWORKS_FAILURE]: (state, err) => {
    console.log(NETWORKS_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchNetworks({ commit }) {
    commit(NETWORKS_REQUEST);

    return NetworksService.get()
      .then((res) => {
        // console.log(res);
        commit(NETWORKS_SUCCESS, { networks: res.data.data });
      }).catch((err) => {
        commit(NETWORKS_FAILURE, err);
      });
  },

  createNetwork({ commit }, data) {
    commit(NETWORKS_REQUEST);
    const obj = data;
    return NetworksService.post(data.server, obj).then((res) => {
      // console.log(res);
      commit(NETWORKS_SUCCESS, res.data);
    }).catch((err) => {
      commit(NETWORKS_FAILURE, err);
    });
  },

  updateNetwork({ commit }, data) {
    commit(NETWORKS_REQUEST);
    const obj = data;
    const name = data.data.name;
    return NetworksService.put(data.server, name, obj).then((res) => {
      // console.log(res);
      commit(NETWORKS_SUCCESS, res.data);
    }).catch((err) => {
      commit(NETWORKS_FAILURE, err);
    });
  },

  deleteNetwork({ commit }, data) {
    commit(NETWORKS_REQUEST);
    return NetworksService.delete(data.server, data.name).then((res) => {
      commit(NETWORKS_SUCCESS, res.data);
    }).catch((err) => {
      commit(NETWORKS_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: networksState,
  getters: networksGetters,
  mutations,
  actions
};
