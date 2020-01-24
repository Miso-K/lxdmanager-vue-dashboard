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

export const SNAPSHOTS_REQUEST = 'SNAPSHOTS_REQUEST';
export const SNAPSHOTS_SUCCESS = 'SNAPSHOTS_SUCCESS';
export const SNAPSHOTS_FAILURE = 'SNAPSHOTS_FAILURE';

export const SNAPSHOT_REQUEST = 'SNAPSHOT_REQUEST';
export const SNAPSHOT_SUCCESS = 'SNAPSHOT_SUCCESS';
export const SNAPSHOT_FAILURE = 'SNAPSHOT_FAILURE';

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
  snapshots: {},
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
  containerDataId: (state, getters) => id => formatContainer(getters.containers.find(obj => obj.id === id)) || false, // eslint-disable-line max-len
  containersStates: (state, getters) => _countBy(getters.containers, 'attributes.state'),
  containersTableData(state, getters) {
    if (Object.keys(getters.containers).length === 0) return false;
    // console.log(getters.hostTotalMemory);
    return _map(getters.containers, container => formatContainer(container, 1024)); // eslint-disable-line max-len
  },
  snapshots: state => state.snapshots,
  snapshotsTableData(state, getters) {
    if (Object.keys(getters.snapshots).length === 0) return false;
    return _map(getters.snapshots, snapshot => snapshot.attributes); // eslint-disable-line max-len
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

  [CONTAINER_REQUEST]: (state, { id, status }) => {
    const index = state.containers.findIndex(e => e.id === id);
    state.loading = true;
    state.containers[index].status = status;
  },
  [CONTAINER_SUCCESS]: (state, { id, data }) => {
    const index = state.containers.findIndex(e => e.id === id);
    state.loading = false;
    Object.assign(state.containers[index], { ...data });
    // state.containers[index] = {
    //  ...state.containers[index],
    //  ...data
    // };
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
  },

  [SNAPSHOTS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [SNAPSHOTS_SUCCESS]: (state, snapshots) => {
    Object.assign(state, { ...snapshots, loading: false });
  },
  [SNAPSHOTS_FAILURE]: (state, err) => {
    console.log(SNAPSHOTS_FAILURE, err);
    Object.assign(state, { loading: false });
  },

  [SNAPSHOT_REQUEST]: (state, { id, attributes }) => {
    state.snapshots[id] = {
      ...state.snapshots[id],
      loading: true,
      attributes: {
        ...state.snapshots[id].snapshots,
        ...attributes
      }
    };
  },
  [SNAPSHOT_SUCCESS]: (state, { id, attributes }) => {
    state.loading = false;
    state.snapshots[id] = {
      ...state.snapshots[id],
      loading: false,
      attributes: {
        ...state.snapshots[id].attributes,
        ...attributes
      }
    };
  },
  [SNAPSHOT_FAILURE]: (state, err, id) => {
    console.log(SNAPSHOT_FAILURE, err);
    state.loading = false;
    state.snapshots[id] = {
      ...state.snapshots[id],
      loading: false
    };
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
      // console.log(res.data);
      res.containers = res.data.data; // when not using json-api-normalizer
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
      console.log(res.data.data);
      setTimeout(() => {
        // objIndex = .findIndex((obj => obj.id == 1));
        // commit(CONTAINER_SUCCESS, { id, attributes: res.containers[id].attributes });
        const data = res.data.data;
        commit(CONTAINER_SUCCESS, { id, data });
        // console.log('fetch:');
        // console.log(res);
      }, 1000);
    }).catch((err) => {
      commit(CONTAINER_FAILURE, err, id);
    });
  },

  createContainer({ dispatch, commit }, data) {
    commit(CONTAINERS_REQUEST);
    // console.log('create log:');
    console.log(data);

    const obj = {
      data: {
        type: 'containers',
        name: data.name,
        config: {
          limits_cpu: data.cpu,
          limits_memory: data.memory,
          limits_disk: data.disk,
          pool_name: data.pool_name,
          price: data.price
        },
        source: {
          type: 'image',
          // mode: 'pull',
          // server: 'https://uk.images.linuxcontainers.org',
          // protocol: 'simplestreams',
          alias: data.os
        },
        relationships: {
          users: data.users ? data.users.map(u => ({
            type: 'users',
            id: u.id
          })) : []
        }
      }
    };
    // console.log(obj);
    return ContainersService.post(obj).then((res) => {
      console.log(res);
      dispatch('fetchOperation', res.data.metadata.id);
      // dispatch('fetchOperation', '8ebb755f-d813-41d7-beca-e3d052f014d6');
      commit(CONTAINERS_SUCCESS);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  upgradeContainer({ commit }, data) {
    commit(CONTAINERS_REQUEST);
    // console.log('create log:');
    // console.log(data);

    const obj = {
      data: {
        type: 'containers',
        name: data.name,
        config: {
          limits_cpu: data.cpu,
          limits_memory: data.memory,
          limits_disk: data.disk
        },
        devices: {}
      }
    };
    // console.log(obj);
    return ContainersService.put(data.id, obj).then((res) => {
      // console.log(res);
      commit(CONTAINERS_SUCCESS, res.data);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  cloneContainer({ commit }, data) {
    commit(CONTAINERS_REQUEST);
    // console.log('create log:');
    console.log(data);

    const obj = {
      data: {
        type: 'containers',
        name: data.containerClone,
        config: {
          limits_cpu: data.cpu,
          limits_memory: data.memory,
          limits_disk: data.disk
        },
        source: {
          type: 'copy',
          container_only: true,
          source: data.containerName
        },
        relationships: {
          users: data.users ? data.users.map(u => ({
            type: 'users',
            id: u
          })) : []
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
      // console.log(res);
      commit(CONTAINERS_SUCCESS, res);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  startContainer({ commit }, id) {
    commit(CONTAINER_REQUEST, { id, status: STARTING });

    ContainersService.start(id).then(() => {
      setTimeout(() => {
        const data = { status: RUNNING };
        commit(CONTAINER_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
      commit(CONTAINER_FAILURE, err, id);
    });
  },

  stopContainer({ commit }, id) {
    commit(CONTAINER_REQUEST, { id, status: STOPPING });

    ContainersService.stop(id).then(() => {
      setTimeout(() => {
        const data = { status: STOPPED };
        commit(CONTAINER_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
      commit(CONTAINER_FAILURE, err, id);
    });
  },

  freezeContainer({ commit }, id) {
    commit(CONTAINER_REQUEST, { id, status: FREEZING });

    ContainersService.freeze(id).then(() => {
      setTimeout(() => {
        const data = { status: FROZEN };
        commit(CONTAINER_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  unfreezeContainer({ commit }, id) {
    commit(CONTAINER_REQUEST, { id, status: UNFREEZING });

    ContainersService.unfreeze(id).then(() => {
      setTimeout(() => {
        const data = { status: RUNNING };
        commit(CONTAINER_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  stopforceContainer({ commit }, id) {
    commit(CONTAINER_REQUEST, { id, status: SHUTTING_DOWN });

    ContainersService.stopforce(id).then(() => {
      setTimeout(() => {
        const data = { status: STOPPED };
        commit(CONTAINER_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  restartContainer({ commit }, id) {
    commit(CONTAINER_REQUEST, { id, status: RESTARTING });

    ContainersService.restart(id).then(() => {
      setTimeout(() => {
        const data = { status: RUNNING };
        commit(CONTAINER_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  openContainerTerminal({ commit }, id) {
    commit(CONTAINERS_REQUEST);

    ContainersService.terminal(id).then((res) => {
      console.log(res);
      setTimeout(() => {
        // commit(CONTAINER_SUCCESS, { id, attributes: res.terminal[id].attributes });
        // console.log(res);
        commit(SET_CONTAINER_TERMINAL, res.data.data);
        // console.log('this');
        // console.log(res.terminal[id].attributes);
      }, 1000);
    }).catch((err) => {
      commit(CONTAINER_FAILURE, err, id);
    });
  },

  fetchSnapshots({ commit }, id) {
    commit(SNAPSHOTS_REQUEST);

    ContainersService.snapshots(id).then((res) => {
      // console.log(res);
      setTimeout(() => {
        commit(SNAPSHOTS_SUCCESS, { snapshots: res.data.data });
        // console.log(res);
      }, 500);
    }).catch((err) => {
      commit(CONTAINERS_FAILURE, err);
    });
  },

  deleteSnapshot({ commit }, { id, name }) {
    // console.log(name);
    commit(SNAPSHOTS_REQUEST);
    ContainersService.snapshotDelete(id, name).then((res) => {
      // console.log(res);
      commit(SNAPSHOTS_SUCCESS, res);
    }).catch((err) => {
      commit(SNAPSHOTS_FAILURE, err);
    });
  },

  restoreSnapshot({ commit }, { id, name }) {
    // console.log(name);
    commit(SNAPSHOTS_REQUEST);
    ContainersService.snapshotRestore(id, name).then((res) => {
      // console.log(res);
      commit(SNAPSHOTS_SUCCESS, res);
    }).catch((err) => {
      commit(SNAPSHOTS_FAILURE, err);
    });
  },

  createSnapshot({ commit }, { id, data }) {
    commit(SNAPSHOTS_REQUEST);
    // console.log('create snapshot log:');
    // console.log(id);
    // console.log(data);

    const obj = {
      data: {
        type: 'snapshots',
        name: data.name,
        stateful: data.stateful
      }
    };
    // console.log(obj);
    return ContainersService.snapshotCreate(id, obj).then((res) => {
      // console.log(res);
      commit(SNAPSHOTS_SUCCESS, res.data);
    }).catch((err) => {
      commit(SNAPSHOTS_FAILURE, err);
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
