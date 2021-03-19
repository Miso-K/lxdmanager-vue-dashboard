import { OperationsService } from '../../services';

export const OPERATIONS_REQUEST = 'STATS_REQUEST';
export const OPERATIONS_SUCCESS = 'STATS_SUCCESS';
export const OPERATIONS_FAILURE = 'STATS_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const operationsState = {
  loading: false,
  operations: {}
};

/**
 * Getters
 * @type {Object}
 */
const operationsGetters = {
  operations: state => state.operations
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [OPERATIONS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [OPERATIONS_SUCCESS]: (state, stats) => {
    Object.assign(state, { ...stats, loading: false });
  },
  [OPERATIONS_FAILURE]: (state, err) => {
    // console.log(OPERATIONS_FAILURE, err);
    Object.assign(state, { status: err, loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchOperation({ dispatch, commit }, data) {
    // commit(SNAPSHOTS_REQUEST);
    // console.log('operation');
    OperationsService.get(data.server, data.id).then((res) => {
      // console.log(res);
      const meta = res.data.metadata;
      setTimeout(() => {
        // commit(SNAPSHOT_SUCCESS, { id, attributes: res.snapshots[id].attributes });
        dispatch('notify', { id: 0, message: `${meta.description}-${meta.status}`, color: '' });
      }, 1000);
    }).catch((err) => {
      commit(OPERATIONS_FAILURE, err, data.id);
    });
  }
};

// Export module
export default {
  state: operationsState,
  getters: operationsGetters,
  mutations,
  actions
};
