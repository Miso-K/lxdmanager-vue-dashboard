import _countBy from 'lodash/countBy';
import _map from 'lodash/map';
import { InstancesService } from '../../services';
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
import formatInstance from '../../utils/format/instance';
import storage from '../../utils/storage';

export const INSTANCES_REQUEST = 'INSTANCES_REQUEST';
export const INSTANCES_SUCCESS = 'INSTANCES_SUCCESS';
export const INSTANCES_FAILURE = 'INSTANCES_FAILURE';

export const INSTANCE_REQUEST = 'INSTANCE_REQUEST';
export const INSTANCE_SUCCESS = 'INSTANCE_SUCCESS';
export const INSTANCE_FAILURE = 'INSTANCE_FAILURE';

export const SNAPSHOTS_REQUEST = 'SNAPSHOTS_REQUEST';
export const SNAPSHOTS_SUCCESS = 'SNAPSHOTS_SUCCESS';
export const SNAPSHOTS_FAILURE = 'SNAPSHOTS_FAILURE';

export const SNAPSHOT_REQUEST = 'SNAPSHOT_REQUEST';
export const SNAPSHOT_SUCCESS = 'SNAPSHOT_SUCCESS';
export const SNAPSHOT_FAILURE = 'SNAPSHOT_FAILURE';

export const INSTANCE_INFO_DIALOG_OPEN = 'INSTANCE_INFO_DIALOG_OPEN';
export const INSTANCE_INFO_DIALOG_CLOSE = 'INSTANCE_INFO_DIALOG_CLOSE';
export const INSTANCE_CREATE_DIALOG_OPEN = 'INSTANCE_CREATE_DIALOG_OPEN';
export const INSTANCE_CREATE_DIALOG_CLOSE = 'INSTANCE_CREATE_DIALOG_CLOSE';
export const INSTANCE_UPGRADE_DIALOG_OPEN = 'INSTANCE_UPGRADE_DIALOG_OPEN';
export const INSTANCE_UPGRADE_DIALOG_CLOSE = 'INSTANCE_UPGRADE_DIALOG_CLOSE';

export const SET_INSTANCES_FILTER = 'SET_INSTANCES_FILTER';
export const SET_INSTANCE_TERMINAL = 'SET_INSTANCE_TERMINAL';

export const STORAGE_INSTANCES_KEY = 'STORAGE_INSTANCES';

const storedInstances = storage.get(STORAGE_INSTANCES_KEY);

/**
 * Initial state
 * @type {Object}
 */
const instancesState = {
  instances: [],
  ins: storedInstances,
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
const instancesGetters = {
  instances: state => state.instances,
  instancesTotal: (state, getters) => Object.keys(getters.instances).length,
  instance: state => id => state.instances[id],
  instanceIsLoading: (state, getters) => id => (getters.instance(id) && getters.instance(id).loading) || false, // eslint-disable-line max-len
  instanceInDialog: (state, getters) => (state.dialogs.info && getters.instance(state.dialogs.info)) || false, // eslint-disable-line max-len
  instanceData(state, getters) {
    return id => formatInstance(getters.instance(id), getters.hostTotalMemory);
  },
  instanceDataId: (state, getters) => id => formatInstance(getters.instances.find(obj => obj.id === id)) || false, // eslint-disable-line max-len
  instancesStates: (state, getters) => _countBy(getters.instances, 'attributes.state'),
  instancesTableData(state, getters) {
    if (Object.keys(getters.instances).length === 0) return false;
    // console.log(getters.hostTotalMemory);
    return _map(getters.instances, instance => formatInstance(instance, 1024)); // eslint-disable-line max-len
  },
  instancesList(state, getters) {
    if (Object.keys(getters.instances).length === 0) return false;
    return _map(getters.instances, instance => ({
      name: instance.name,
      id: instance.id
    }));
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
const instancesMutations = {
  [INSTANCES_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [INSTANCES_SUCCESS]: (state, instances) => {
    Object.assign(state, { ...instances, loading: false });
    storage.set(STORAGE_INSTANCES_KEY, instances.instances.map(instance => ({
      name: instance.name,
      id: instance.id
    })));
  },
  [INSTANCES_FAILURE]: (state, err) => {
    console.log(INSTANCES_FAILURE, err);
    Object.assign(state, { loading: false });
    storage.remove(STORAGE_INSTANCES_KEY);
  },

  [INSTANCE_REQUEST]: (state, { id, status }) => {
    const index = state.instances.findIndex(e => e.id === id);
    state.loading = true;
    state.instances[index].status = status;
  },
  [INSTANCE_SUCCESS]: (state, { id, data }) => {
    const index = state.instances.findIndex(e => e.id === id);
    state.loading = false;
    Object.assign(state.instances[index], { ...data });
    // state.instances[index] = {
    //  ...state.instances[index],
    //  ...data
    // };
    // storage.set(STORAGE_INSTANCES_KEY, state.instances);
  },
  [INSTANCE_FAILURE]: (state, err, id) => {
    console.log(INSTANCE_FAILURE, err);
    state.loading = false;
    state.instances[id] = {
      ...state.instances[id],
      loading: false
    };
    // storage.remove(STORAGE_INSTANCES_KEY);
  },

  [INSTANCE_INFO_DIALOG_OPEN]: (state, id) => {
    state.dialogs.info = id;
  },
  [INSTANCE_INFO_DIALOG_CLOSE]: (state) => {
    state.dialogs.info = null;
  },
  [INSTANCE_CREATE_DIALOG_OPEN]: (state) => {
    state.dialogs.create = true;
  },
  [INSTANCE_CREATE_DIALOG_CLOSE]: (state) => {
    state.dialogs.create = false;
  },
  [INSTANCE_UPGRADE_DIALOG_OPEN]: (state) => {
    state.dialogs.upgrade = true;
  },
  [INSTANCE_UPGRADE_DIALOG_CLOSE]: (state) => {
    state.dialogs.upgrade = null;
  },

  [SET_INSTANCES_FILTER]: (state, filter) => {
    state.filter = filter;
  },

  [SET_INSTANCE_TERMINAL]: (state, terminal) => {
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
const instancesActions = {
  fetchInstances({ commit }) {
    commit(INSTANCES_REQUEST);

    InstancesService.get().then((res) => {
      res.instances = res.data.data; // when not using json-api-normalizer
      setTimeout(() => {
        commit(INSTANCES_SUCCESS, res);
        // console.log(res);
      }, 500);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
    });
  },

  fetchInstance({ commit }, id) {
    commit(INSTANCES_REQUEST);

    InstancesService.fetch(id).then((res) => {
      console.log(res.data.data);
      setTimeout(() => {
        const data = res.data.data;
        commit(INSTANCE_SUCCESS, { id, data });
      }, 1000);
    }).catch((err) => {
      commit(INSTANCE_FAILURE, err, id);
    });
  },

  createInstance({ dispatch, commit }, data) {
    commit(INSTANCES_REQUEST);
    // console.log(data);

    const obj = {
      data: {
        type: 'instances',
        instance: {
          name: data.name,
          config: {
            'limits.cpu': data.cpu.toString(),
            'limits.memory': data.memory,
            'user.price': data.price,
            'user.period': data.period
          },
          source: {
            type: 'image',
            alias: data.os
          },
          devices: data.pool_name ? {
            root: {
              path: '/',
              pool: data.pool_name,
              type: 'disk',
              size: data.disk
            }
          } : {}
        },
        name: data.name,
        relationships: {
          users: data.users ? data.users.map(u => ({
            type: 'users',
            id: u
          })) : []
        }
      }
    };
    console.log(obj);
    return InstancesService.post(obj).then((res) => {
      // console.log(res);
      dispatch('fetchOperation', res.data.metadata.id);
      // dispatch('fetchOperation', '8ebb755f-d813-41d7-beca-e3d052f014d6');
      commit(INSTANCES_SUCCESS);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
    });
  },

  upgradeInstance({ commit }, data) {
    commit(INSTANCES_REQUEST);
    // console.log(data);

    const obj = {
      data: {
        type: 'instances',
        name: data.name,
        instance: {
          name: data.name,
          config: {
            'limits.cpu': data.cpu.toString(),
            'limits.memory': data.memory,
            'user.price': data.price,
            'user.period': data.period
          },
          devices: data.pool_name ? {
            root: {
              path: '/',
              pool: data.pool_name,
              type: 'disk',
              size: data.disk
            }
          } : {}
        }
      }
    };
    // console.log(obj);
    return InstancesService.patch(data.id, obj).then((res) => {
      // console.log(res);
      commit(INSTANCES_SUCCESS, res.data);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
    });
  },

  cloneInstance({ commit }, data) {
    commit(INSTANCES_REQUEST);
    // console.log('create log:');
    console.log(data);

    const obj = {
      data: {
        type: 'instances',
        instance: {
          name: data.instanceClone,
          config: {
            'limits.cpu': data.cpu.toString(),
            'limits.memory': data.memory,
            'user.price': data.price,
            'user.period': data.period
          },
          source: {
            type: 'copy',
            instance_only: true,
            source: data.instanceName
          },
          devices: data.pool_name ? {
            root: {
              path: '/',
              pool: data.pool_name,
              type: 'disk',
              size: data.disk
            }
          } : {}
        },
        name: data.instanceClone,
        relationships: {
          users: data.users ? data.users.map(u => ({
            type: 'users',
            id: u
          })) : []
        }
      }
    };
    // console.log(obj);
    return InstancesService.post(obj).then((res) => {
      // console.log(res);
      commit(INSTANCES_SUCCESS, res.data);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
    });
  },

  deleteInstance({ dispatch, commit }, id) {
    commit(INSTANCES_REQUEST);
    console.log(id);
    InstancesService.delete(id).then((res) => {
      // console.log(res);
      commit(INSTANCES_SUCCESS, res);
    }).catch((err) => {
      dispatch('notify', { id: 0, message: err, color: '' });
      commit(INSTANCES_FAILURE, err);
    });
  },

  startInstance({ commit }, id) {
    commit(INSTANCE_REQUEST, { id, status: STARTING });

    InstancesService.start(id).then(() => {
      setTimeout(() => {
        const data = { status: RUNNING };
        commit(INSTANCE_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
      commit(INSTANCE_FAILURE, err, id);
    });
  },

  stopInstance({ commit }, id) {
    commit(INSTANCE_REQUEST, { id, status: STOPPING });

    InstancesService.stop(id).then(() => {
      setTimeout(() => {
        const data = { status: STOPPED };
        commit(INSTANCE_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
      commit(INSTANCE_FAILURE, err, id);
    });
  },

  freezeInstance({ commit }, id) {
    commit(INSTANCE_REQUEST, { id, status: FREEZING });

    InstancesService.freeze(id).then(() => {
      setTimeout(() => {
        const data = { status: FROZEN };
        commit(INSTANCE_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
    });
  },

  unfreezeInstance({ commit }, id) {
    commit(INSTANCE_REQUEST, { id, status: UNFREEZING });

    InstancesService.unfreeze(id).then(() => {
      setTimeout(() => {
        const data = { status: RUNNING };
        commit(INSTANCE_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
    });
  },

  stopforceInstance({ commit }, id) {
    commit(INSTANCE_REQUEST, { id, status: SHUTTING_DOWN });

    InstancesService.stopforce(id).then(() => {
      setTimeout(() => {
        const data = { status: STOPPED };
        commit(INSTANCE_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
    });
  },

  restartInstance({ commit }, id) {
    commit(INSTANCE_REQUEST, { id, status: RESTARTING });

    InstancesService.restart(id).then(() => {
      setTimeout(() => {
        const data = { status: RUNNING };
        commit(INSTANCE_SUCCESS, { id, data });
      }, 2000);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
    });
  },

  openInstanceTerminal({ commit }, id) {
    commit(INSTANCES_REQUEST);

    InstancesService.terminal(id).then((res) => {
      console.log(res);
      setTimeout(() => {
        // commit(INSTANCE_SUCCESS, { id, attributes: res.terminal[id].attributes });
        // console.log(res);
        commit(SET_INSTANCE_TERMINAL, res.data.data);
        // console.log('this');
        // console.log(res.terminal[id].attributes);
      }, 1000);
    }).catch((err) => {
      commit(INSTANCE_FAILURE, err, id);
    });
  },

  fetchSnapshots({ commit }, id) {
    commit(SNAPSHOTS_REQUEST);

    InstancesService.snapshots(id).then((res) => {
      // console.log(res);
      setTimeout(() => {
        commit(SNAPSHOTS_SUCCESS, { snapshots: res.data.data });
        // console.log(res);
      }, 500);
    }).catch((err) => {
      commit(INSTANCES_FAILURE, err);
    });
  },

  deleteSnapshot({ commit }, { id, name }) {
    // console.log(name);
    commit(SNAPSHOTS_REQUEST);
    InstancesService.snapshotDelete(id, name).then((res) => {
      // console.log(res);
      commit(SNAPSHOTS_SUCCESS, res);
    }).catch((err) => {
      commit(SNAPSHOTS_FAILURE, err);
    });
  },

  restoreSnapshot({ commit }, { id, name }) {
    // console.log(name);
    commit(SNAPSHOTS_REQUEST);
    InstancesService.snapshotRestore(id, name).then((res) => {
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
    return InstancesService.snapshotCreate(id, obj).then((res) => {
      // console.log(res);
      commit(SNAPSHOTS_SUCCESS, res.data);
    }).catch((err) => {
      commit(SNAPSHOTS_FAILURE, err);
    });
  },

  openInstanceInfoDialog({ commit }, id) {
    commit(INSTANCE_INFO_DIALOG_OPEN, id);
  },
  closeInstanceInfoDialog({ commit }) {
    commit(INSTANCE_INFO_DIALOG_CLOSE);
  },
  openInstanceCreateDialog({ commit }) {
    commit(INSTANCE_CREATE_DIALOG_OPEN);
  },
  closeInstanceCreateDialog({ commit }) {
    commit(INSTANCE_CREATE_DIALOG_CLOSE);
  },
  openInstanceUpgradeDialog({ commit }) {
    commit(INSTANCE_UPGRADE_DIALOG_OPEN);
  },
  closeInstanceUpgradeDialog({ commit }) {
    commit(INSTANCE_UPGRADE_DIALOG_CLOSE);
  },

  setInstancesFilters({ commit }, filter) {
    commit(SET_INSTANCES_FILTER, filter);
  }
};

// Export module
export default {
  state: instancesState,
  getters: instancesGetters,
  mutations: instancesMutations,
  actions: instancesActions
};
