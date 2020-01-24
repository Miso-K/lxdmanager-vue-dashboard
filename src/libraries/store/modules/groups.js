import _map from 'lodash/map';
import { GroupsService } from '../../services';

export const GROUPS_REQUEST = 'GROUPS_REQUEST';
export const GROUPS_SUCCESS = 'GROUPS_SUCCESS';
export const GROUPS_FAILURE = 'GROUPS_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const groupsState = {
  groups: {},
  loading: false
};

/**
 * Getters
 * @type {Object}
 */
const groupsGetters = {
  groups: state => state.groups,
  group: state => id => state.groups[id],
  groupsTableData(state, getters) {
    if (Object.keys(getters.groups).length === 0) return false;
    return _map(getters.groups, group => group); // eslint-disable-line max-len
  }
};

/**
 * Mutations
 * @type {Object}
 */
const groupsMutations = {
  [GROUPS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [GROUPS_SUCCESS]: (state, groups) => {
    Object.assign(state, { ...groups, loading: false });
  },
  [GROUPS_FAILURE]: (state, err) => {
    console.log(GROUPS_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const groupsActions = {
  fetchGroups({ commit }) {
    commit(GROUPS_REQUEST);

    return GroupsService.get().then((res) => {
      res.groups = res.data.data;
      commit(GROUPS_SUCCESS, res);
    }).catch((err) => {
      commit(GROUPS_FAILURE, err);
    });
  },

  createGroup({ commit }, data) {
    commit(GROUPS_REQUEST);
    // console.log('create log:');
    // console.log(data);

    const obj = {
      data: {
        type: 'groups',
        name: data.name,
        relationships: {
          abilities: data.abilities ? data.abilities.map(a => ({
            type: 'ability',
            id: a
          })) : []
        }
      }
    };
    // console.log(obj);
    return GroupsService.post(obj).then((res) => {
      // console.log(res);
      commit(GROUPS_SUCCESS, res.data.data);
    }).catch((err) => {
      commit(GROUPS_FAILURE, err);
    });
  },

  updateGroup({ commit }, data) {
    commit(GROUPS_REQUEST);
    // console.log('update log:');
    // console.log(data);

    const obj = {
      data: {
        type: 'groups',
        id: data.id,
        name: data.name,
        relationships: {
          abilities: data.abilities ? data.abilities.map(a => ({
            type: 'ability',
            id: a
          })) : []
        }
      }
    };
    // console.log(obj);
    return GroupsService.put(data.id, obj).then((res) => {
      // console.log(res);
      commit(GROUPS_SUCCESS, res.data.data);
    }).catch((err) => {
      commit(GROUPS_FAILURE, err);
    });
  },

  deleteGroup({ commit }, id) {
    commit(GROUPS_REQUEST);
    GroupsService.delete(id).then((res) => {
      commit(GROUPS_SUCCESS, res);
    }).catch((err) => {
      commit(GROUPS_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: groupsState,
  getters: groupsGetters,
  mutations: groupsMutations,
  actions: groupsActions
};
