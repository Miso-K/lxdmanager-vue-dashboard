import _map from 'lodash/map';
import { ProjectsService } from '../../services';

export const PROJECTS_REQUEST = 'PROJECTS_REQUEST';
export const PROJECTS_SUCCESS = 'PROJECTS_SUCCESS';
export const PROJECTS_FAILURE = 'PROJECTS_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const projectsState = {
  loading: false,
  projects: {}
};

/**
 * Getters
 * @type {Object}
 */
const projectsGetters = {
  projects: state => state.projects, // eslint-disable-line no-confusing-arrow, max-len
  projectsTableData(state, getters) {
    if (Object.keys(getters.projects).length === 0) return false;
    return _map(getters.projects, project => project); // eslint-disable-line max-len
  }
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [PROJECTS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [PROJECTS_SUCCESS]: (state, projects) => {
    Object.assign(state, { ...projects, loading: false });
  },
  [PROJECTS_FAILURE]: (state, err) => {
    console.log(PROJECTS_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchProjects({ commit }) {
    commit(PROJECTS_REQUEST);

    return ProjectsService.get()
      .then((res) => {
        // console.log(res);
        commit(PROJECTS_SUCCESS, { projects: res.data.data });
      }).catch((err) => {
        commit(PROJECTS_FAILURE, err);
      });
  },

  createProject({ commit }, data) {
    commit(PROJECTS_REQUEST);
    const obj = data;
    return ProjectsService.post(data.server, obj).then((res) => {
      // console.log(res);
      commit(PROJECTS_SUCCESS, res.data);
    }).catch((err) => {
      commit(PROJECTS_FAILURE, err);
    });
  },

  updateProject({ commit }, data) {
    commit(PROJECTS_REQUEST);
    const obj = data;
    const name = data.data.name;
    return ProjectsService.put(data.server, name, obj).then((res) => {
      // console.log(res);
      commit(PROJECTS_SUCCESS, res.data);
    }).catch((err) => {
      commit(PROJECTS_FAILURE, err);
    });
  },

  deleteProject({ commit }, data) {
    commit(PROJECTS_REQUEST);
    return ProjectsService.delete(data.server, data.name).then((res) => {
      commit(PROJECTS_SUCCESS, res.data);
    }).catch((err) => {
      commit(PROJECTS_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: projectsState,
  getters: projectsGetters,
  mutations,
  actions
};
