import { StatsService } from '../../services';

const statsId = 1;

export const STATS_REQUEST = 'STATS_REQUEST';
export const STATS_SUCCESS = 'STATS_SUCCESS';
export const STATS_FAILURE = 'STATS_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const statsState = {
  loading: false,
  stats: {}
};

/**
 * Getters
 * @type {Object}
 */
const statsGetters = {
  stats: state => state.stats[statsId] ? state.stats[statsId].attributes : state.stats, // eslint-disable-line no-confusing-arrow, max-len
  statsTotalMemory: (state, getters) => (getters.stats.memory && getters.stats.memory) || 0, // eslint-disable-line max-len
  statsTotalDisk: (state, getters) => (getters.stats.disk && getters.stats.disk[0]) || 0,
  statsCPUs: (state, getters) => (getters.stats.cpu && getters.stats.cpu.physical) || 0
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [STATS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [STATS_SUCCESS]: (state, stats) => {
    Object.assign(state, { ...stats, loading: false });
  },
  [STATS_FAILURE]: (state, err) => {
    console.log(STATS_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchStats({ commit }) {
    commit(STATS_REQUEST);

    return StatsService.get()
      .then((res) => {
        console.log(res);
        commit(STATS_SUCCESS, { stats: res.data.data });
      }).catch((err) => {
        commit(STATS_FAILURE, err);
      });
  }
};

// Export module
export default {
  state: statsState,
  getters: statsGetters,
  mutations,
  actions
};
