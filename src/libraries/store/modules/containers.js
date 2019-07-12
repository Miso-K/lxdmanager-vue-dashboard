import _countBy from 'lodash/countBy';
import _map from 'lodash/map';
import { ContainersService } from '../../services';
import {
  ALL,
  FREEZING,
  FROZEN,
  RESTARTING,
  RUNNING,
  SHUTTING_DOWN,
  STARTING,
  STOPPED,
  STOPPING,
  UNFREEZING
} from '../../utils/states';
import formatContainer from '../../utils/format/container';

export const CONTAINERS_REQUEST = 'CONTAINERS_REQUEST';
export const CONTAINERS_SUCCESS = 'CONTAINERS_SUCCESS';
export const CONTAINERS_FAILURE = 'CONTAINERS_FAILURE';

export const CONTAINER_REQUEST = 'CONTAINER_REQUEST';
export const CONTAINER_SUCCESS = 'CONTAINER_SUCCESS';
export const CONTAINER_FAILURE = 'CONTAINER_FAILURE';

export const CONTAINER_INFO_DIALOG_OPEN = 'CONTAINER_INFO_DIALOG_OPEN';
export const CONTAINER_INFO_DIALOG_CLOSE = 'CONTAINER_INFO_DIALOG_CLOSE';
export const CONTAINER_CREATE_DIALOG_OPEN = 'CONTAINER_CREATE_DIALOG_OPEN';
export const CONTAINER_CREATE_DIALOG_CLOSE = 'CONTAINER_CREATE_DIALOG_CLOSE';
export const CONTAINER_UPGRADE_DIALOG_OPEN = 'CONTAINER_UPGRADE_DIALOG_OPEN';
export const CONTAINER_UPGRADE_DIALOG_CLOSE = 'CONTAINER_UPGRADE_DIALOG_CLOSE';

export const SET_CONTAINERS_FILTER = 'SET_CONTAINERS_FILTER';
export const SET_CONTAINER_TERMINAL = 'SET_CONTAINER_TERMINAL';

/**
 * Initial state
 * @type {Object}
 */
const containersState = {
  containers: {},
  loading: false,
  dialogs: {
    info: null,
    create: false,
    upgrade: null
  },
  filter: ALL,
  terminal: {}
};

/**
 * Getters
 * @type {Object}
 */
const containersGetters = {
  containers: state => state.containers,
  containersTotal: (state, getters) => Object.keys(getters.containers).length,
  container: state => id => state.containers[id],
  containerIsLoading: (state, getters) => id => (getters.container(id) && getters.container(id).loading) || false, // eslint-disable-line max-len
  containerInDialog: (state, getters) => (state.dialogs.info && getters.container(state.dialogs.info)) || false, // eslint-disable-line max-len
  containerData(state, getters) {
    return id => formatContainer(getters.container(id), getters.hostTotalMemory);
  },
  containerDataId: state => id => formatContainer(state.containers[id]) || false, // eslint-disable-line max-len
  containersStates: (state, getters) => _countBy(getters.containers, 'attributes.state'),
  containersTableData(state, getters) {
    if (Object.keys(getters.containers).length === 0) return false;
    // console.log(getters.hostTotalMemory);
    return _map(getters.containers, container => formatContainer(container, 1024)); // eslint-disable-line max-len
  }
};

/**
 * Mutations
 * @type {Object}
 */
/* eslint-disable no-param-reassign */
const containersMutations = {
  [CONTAINERS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [CONTAINERS_SUCCESS]: (state, containers) => {
    Object.assign(state, { ...containers, loading: false });
  },
  [CONTAINERS_FAILURE]: (state, err) => {
    console.log(CONTAINERS_FAILURE, err);
    Object.assign(state, { loading: false });
  },

  [CONTAINER_REQUEST]: (state, { id, attributes }) => {
    state.containers[id] = {
      ...state.containers[id],
      loading: true,
      attributes: {
        ...state.containers[id].attributes,
        ...attributes
      }
    };
  },
  [CONTAINER_SUCCESS]: (state, { id, attributes }) => {
    state.loading = false;
    state.containers[id] = {
      ...state.containers[id],
      loading: false,
      attributes: {
        ...state.containers[id].attributes,
        ...attributes
      }
    };
  },
  [CONTAINER_FAILURE]: (state, err, id) => {
    console.log(CONTAINER_FAILURE, err);
    state.loading = false;
    state.containers[id] = {
      ...state.containers[id],
      loading: false
    };
  },

  [CONTAINER_INFO_DIALOG_OPEN]: (state, id) => {
    state.dialogs.info = id;
  },
  [CONTAINER_INFO_DIALOG_CLOSE]: (state) => {
    state.dialogs.info = null;
  },
  [CONTAINER_CREATE_DIALOG_OPEN]: (state) => {
    state.dialogs.create = true;
  },
  [CONTAINER_CREATE_DIALOG_CLOSE]: (state) => {
    state.dialogs.create = false;
  },
  [CONTAINER_UPGRADE_DIALOG_OPEN]: (state) => {
    state.dialogs.upgrade = true;
  },
  [CONTAINER_UPGRADE_DIALOG_CLOSE]: (state) => {
    state.dialogs.upgrade = null;
  },

  [SET_CONTAINERS_FILTER]: (state, filter) => {
    state.filter = filter;
  },

  [SET_CONTAINER_TERMINAL]: (state, terminal) => {
    state.loading = false;
    state.terminal = terminal;
  }
};
/* eslint-enable no-param-reassign */

/**
 * Actions
 * @type {Object}
 */
const containersActions = {
  fetchContainers({ commit }) {
    commit(CONTAINERS_REQUEST);

    ContainersService.get().then((res) => {
      // console.log(res);
      setTimeout(() => {
        commit(CONTAINERS_SUCCESS, res);
        // console.log(res);
      }, 500);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  fetchContainer({ commit }, id) {
    commit(CONTAINERS_REQUEST);

    ContainersService.fetch(id).then((res) => {
      // console.log(res);
      setTimeout(() => {
        // commit(CONTAINER_SUCCESS, { id, attributes: res.containers[id].attributes });
        commit(CONTAINER_SUCCESS, { id, attributes: res.containers[id].attributes });
        // console.log('fetch:');
        // console.log(res);
      }, 1000);
    }).catch((err) => {
      commit(CONTAINER_FAILURE, err, id);
    });
  },

  createContainer({ commit }, data) {
    commit(CONTAINERS_REQUEST);
    // console.log('create log:');
    console.log(data);

    const obj = {
      data: {
        type: 'containers',
        attributes: {
          name: data.name,
          config: {
            limits_cpu: data.cpu,
            limits_memory: [data.memory, 'MB'].join(''),
            limits_disk: data.disk
          },
          source: {
            type: 'image',
            alias: data.os
          }
        },
        relationships: {
          users: {
            data: data.users ? data.users.map(u => ({
              type: 'users',
              id: u
            })) : []
          }
        }
      }
    };
    // console.log(obj);
    return ContainersService.post(obj).then((res) => {
      // console.log(res);
      commit(CONTAINERS_SUCCESS, res.data);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  deleteContainer({ commit }, id) {
    commit(CONTAINERS_REQUEST);
    ContainersService.delete(id).then((res) => {
      console.log(res);
      commit(CONTAINERS_SUCCESS, res);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  startContainer({ dispatch, commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { status: STARTING } });

    ContainersService.start(id).then(() => {
      // console.log(res);
      commit(CONTAINERS_SUCCESS);
      setTimeout(() => {
        commit(CONTAINER_SUCCESS, { id, attributes: { status: RUNNING } });
        dispatch('fetchContainer', id);
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
      commit(CONTAINER_FAILURE, err, id);
    });
  },

  stopContainer({ dispatch, commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { status: STOPPING } });

    ContainersService.stop(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      setTimeout(() => {
        commit(CONTAINER_SUCCESS, { id, attributes: { status: STOPPED } });
        dispatch('fetchContainer', id);
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
      commit(CONTAINER_FAILURE, err, id);
    });
  },

  freezeContainer({ dispatch, commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { status: FREEZING } });

    ContainersService.freeze(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      setTimeout(() => {
        commit(CONTAINER_SUCCESS, { id, attributes: { status: FROZEN } });
        dispatch('fetchContainer', id);
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  unfreezeContainer({ dispatch, commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { status: UNFREEZING } });

    ContainersService.unfreeze(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      setTimeout(() => {
        commit(CONTAINER_SUCCESS, { id, attributes: { status: RUNNING } });
        dispatch('fetchContainer', id);
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  stopforceContainer({ dispatch, commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { status: SHUTTING_DOWN } });

    ContainersService.stopforce(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      setTimeout(() => {
        commit(CONTAINER_SUCCESS, { id, attributes: { status: STOPPED } });
        dispatch('fetchContainer', id);
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  restartContainer({ dispatch, commit }, id) {
    commit(CONTAINERS_REQUEST);
    commit(CONTAINER_REQUEST, { id, attributes: { status: RESTARTING } });

    ContainersService.restart(id).then(() => {
      commit(CONTAINERS_SUCCESS);
      commit(CONTAINER_SUCCESS, { id, attributes: { status: STOPPED } });
      setTimeout(() => {
        commit(CONTAINER_SUCCESS, { id, attributes: { status: RUNNING } });
        dispatch('fetchContainer', id);
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  openContainerTerminal({ commit }, id) {
    commit(CONTAINERS_REQUEST);

    ContainersService.terminal(id).then((res) => {
      // console.log(res);
      setTimeout(() => {
        // commit(CONTAINER_SUCCESS, { id, attributes: res.terminal[id].attributes });
        // console.log(res);
        commit(SET_CONTAINER_TERMINAL, res.terminal[id].attributes);
        // console.log('this');
        // console.log(res.terminal[id].attributes);
      }, 1000);
    }).catch((err) => {
      commit(CONTAINER_FAILURE, err, id);
    });
  },

  openContainerInfoDialog({ commit }, id) {
    commit(CONTAINER_INFO_DIALOG_OPEN, id);
  },
  closeContainerInfoDialog({ commit }) {
    commit(CONTAINER_INFO_DIALOG_CLOSE);
  },
  openContainerCreateDialog({ commit }) {
    commit(CONTAINER_CREATE_DIALOG_OPEN);
  },
  closeContainerCreateDialog({ commit }) {
    commit(CONTAINER_CREATE_DIALOG_CLOSE);
  },
  openContainerUpgradeDialog({ commit }) {
    commit(CONTAINER_UPGRADE_DIALOG_OPEN);
  },
  closeContainerUpgradeDialog({ commit }) {
    commit(CONTAINER_UPGRADE_DIALOG_CLOSE);
  },

  setContainersFilters({ commit }, filter) {
    commit(SET_CONTAINERS_FILTER, filter);
  }
};

// Export module
export default {
  state: containersState,
  getters: containersGetters,
  mutations: containersMutations,
  actions: containersActions
};
