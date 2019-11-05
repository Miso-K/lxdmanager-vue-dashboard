import _map from 'lodash/map';
import { RequestsService } from '../../services';
import formatRequest from '../../utils/format/request';

export const REQUESTS_REQUEST = 'REQUESTS_REQUEST';
export const REQUESTS_SUCCESS = 'REQUESTS_SUCCESS';
export const REQUESTS_FAILURE = 'REQUESTS_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const requestsState = {
  requests: {},
  loading: true
};

/**
 * Getters
 * @type {Object}
 */
const requestsGetters = {
  requests: state => state.requests,
  request: state => id => state.requests[id],
  requestsTableData(state, getters) {
    if (Object.keys(getters.requests).length === 0) return false;
    return _map(getters.requests, request => formatRequest(request)); // eslint-disable-line max-len
  }
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [REQUESTS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [REQUESTS_SUCCESS]: (state, host) => {
    Object.assign(state, { ...host, loading: false });
  },
  [REQUESTS_FAILURE]: (state, err) => {
    console.log(REQUESTS_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchRequests({ commit }) {
    commit(REQUESTS_REQUEST);

    return RequestsService.get()
      .then((res) => {
        // console.log(res);
        commit(REQUESTS_SUCCESS, res);
      }).catch((err) => {
        commit(REQUESTS_FAILURE, err);
      });
  },

  createRequests({ commit }, { action, message, status, meta_data }) {
    commit(REQUESTS_REQUEST);
    console.log(action + message + status);
    const obj = {
      data: {
        type: 'requests',
        attributes: {
          action,
          message,
          status,
          meta_data
        }
      }
    };
    console.log(obj);
    return RequestsService.request(obj).then((res) => {
      // console.log(res);
      commit(REQUESTS_SUCCESS, res.data);
    }).catch((err) => {
      commit(REQUESTS_FAILURE, err);
    });
  },

  changeRequests({ commit }, { id, message, status }) {
    commit(REQUESTS_REQUEST);
    console.log(message + status);
    const obj = {
      data: {
        type: 'requests',
        attributes: {
          message,
          status
        }
      }
    };
    console.log(obj);
    return RequestsService.put(id, obj).then((res) => {
      console.log(res);
      commit(REQUESTS_SUCCESS, res.data);
    }).catch((err) => {
      commit(REQUESTS_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: requestsState,
  getters: requestsGetters,
  mutations,
  actions
};
