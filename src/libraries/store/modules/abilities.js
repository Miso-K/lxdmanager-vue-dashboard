import _map from 'lodash/map';
import { AbilitiesService } from '../../services';

export const ABILITIES_REQUEST = 'ABILITIES_REQUEST';
export const ABILITIES_SUCCESS = 'ABILITIES_SUCCESS';
export const ABILITIES_FAILURE = 'ABILITIES_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const abilitiesState = {
  abilities: {},
  loading: false
};

/**
 * Getters
 * @type {Object}
 */
const abilitiesGetters = {
  abilities: state => state.abilities,
  ability: state => id => state.abilities[id],
  abilitiessTableData(state, getters) {
    if (Object.keys(getters.abilities).length === 0) return false;
    return _map(getters.abilities, ability => ability); // eslint-disable-line max-len
  }
};

/**
 * Mutations
 * @type {Object}
 */
const abilitiesMutations = {
  [ABILITIES_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [ABILITIES_SUCCESS]: (state, abilities) => {
    Object.assign(state, { ...abilities, loading: false });
  },
  [ABILITIES_FAILURE]: (state, err) => {
    console.log(ABILITIES_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const abilitiesActions = {
  fetchAbilities({ commit }) {
    commit(ABILITIES_REQUEST);

    return AbilitiesService.get().then((res) => {
      res.abilities = res.data.data;
      commit(ABILITIES_SUCCESS, res);
    }).catch((err) => {
      commit(ABILITIES_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: abilitiesState,
  getters: abilitiesGetters,
  mutations: abilitiesMutations,
  actions: abilitiesActions
};
