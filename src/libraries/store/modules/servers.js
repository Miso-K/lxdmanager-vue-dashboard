import _map from 'lodash/map';
import { ServersService } from '../../services';

export const SERVERS_REQUEST = 'SERVERS_REQUEST';
export const SERVERS_SUCCESS = 'SERVERS_SUCCESS';
export const SERVERS_FAILURE = 'SERVERS_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const serversState = {
  loading: false,
  servers: {}
};

/**
 * Getters
 * @type {Object}
 */
const serversGetters = {
  servers: state => state.servers, // eslint-disable-line no-confusing-arrow, max-len
  serversTableData(state, getters) {
    if (Object.keys(getters.servers).length === 0) return false;
    return _map(getters.servers, server => server); // eslint-disable-line max-len
  }
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [SERVERS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [SERVERS_SUCCESS]: (state, servers) => {
    Object.assign(state, { ...servers, loading: false });
  },
  [SERVERS_FAILURE]: (state, err) => {
    console.log(SERVERS_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchServers({ commit }) {
    commit(SERVERS_REQUEST);

    return ServersService.get()
      .then((res) => {
        // console.log(res);
        commit(SERVERS_SUCCESS, { servers: res.data.data });
      }).catch((err) => {
        commit(SERVERS_FAILURE, err);
      });
  },

  createServer({ commit }, data) {
    commit(SERVERS_REQUEST);
    const obj = data;
    // console.log(obj);
    return ServersService.post(obj).then((res) => {
      // console.log(res);
      commit(SERVERS_SUCCESS, res.data);
    }).catch((err) => {
      commit(SERVERS_FAILURE, err);
    });
  },

  updateServer({ commit }, data) {
    commit(SERVERS_REQUEST);
    const obj = data;
    const name = data.data.name;
    return ServersService.put(name, obj).then((res) => {
      // console.log(res);
      commit(SERVERS_SUCCESS, res.data);
    }).catch((err) => {
      commit(SERVERS_FAILURE, err);
    });
  },

  deleteServer({ commit }, name) {
    commit(SERVERS_REQUEST);
    return ServersService.delete(name).then((res) => {
      commit(SERVERS_SUCCESS, res.data);
    }).catch((err) => {
      commit(SERVERS_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: serversState,
  getters: serversGetters,
  mutations,
  actions
};
