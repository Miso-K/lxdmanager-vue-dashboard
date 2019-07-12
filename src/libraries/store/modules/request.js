import { RequestService } from '../../services';
// import {TOKEN_FAILURE, TOKEN_REQUEST, TOKEN_SUCCESS} from "./auth";

export const REQUEST_REQUEST = 'REQUEST_REQUEST';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
export const REQUEST_FAILURE = 'REQUEST_FAILURE';

/**
 * Initial state
 * @type {Object}
 */
const requestState = {
  loading: true
};

/**
 * Getters
 * @type {Object}
 */
const requestGetters = {
};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  [REQUEST_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [REQUEST_SUCCESS]: (state, host) => {
    Object.assign(state, { ...host, loading: false });
  },
  [REQUEST_FAILURE]: (state, err) => {
    console.log(REQUEST_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {
  fetchRequest({ commit }) {
    commit(REQUEST_REQUEST);

    return RequestService.get()
      .then((res) => {
        commit(REQUEST_SUCCESS, { ret: res.stats });
      }).catch((err) => {
        commit(REQUEST_FAILURE, err);
      });
  },

  sendRequest({ commit }, { subject, message, ecopy }) {
    commit(REQUEST_REQUEST);
    // console.log(subject + message + copy);
    return RequestService.request({
      subject: subject.trim(),
      message: message.trim(),
      copy: ecopy ? ecopy !== null : false
    }).then((res) => {
      // console.log(res);
      commit(REQUEST_SUCCESS, res.data);
    }).catch((err) => {
      commit(REQUEST_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: requestState,
  getters: requestGetters,
  mutations,
  actions
};
